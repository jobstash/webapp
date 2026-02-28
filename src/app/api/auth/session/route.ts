import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { clientEnv } from '@/lib/env/client';
import type { User } from '@privy-io/server-auth';

import {
  extractEmbeddedWallet,
  getPrivyUser,
  verifyPrivyToken,
} from '@/lib/server/privy';
import { getSession } from '@/lib/server/session';
import { getDisplayName } from '@/features/auth/server/get-display-name';

const SESSION_EXPIRY = 55 * 60 * 1000;

const toSessionPayload = (session: {
  apiToken?: string;
  expiresAt?: number;
  isExpert?: boolean;
  displayName?: string;
  identityType?: string;
}) => ({
  apiToken: session.apiToken ?? null,
  expiresAt: session.expiresAt ?? null,
  isExpert: session.isExpert ?? null,
  displayName: session.displayName ?? null,
  identityType: session.identityType ?? null,
});

const checkWalletResponseSchema = z.object({
  token: z.string().min(1),
  cryptoNative: z.boolean(),
  permissions: z.array(z.string()).min(1),
});

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const authHeader = req.headers.get('authorization') ?? '';
  const privyToken = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : '';

  if (!privyToken) {
    return NextResponse.json({ error: 'No Privy token' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const loginMethod =
    typeof body?.loginMethod === 'string' ? body.loginMethod : undefined;

  let privyClaims: Awaited<ReturnType<typeof verifyPrivyToken>>;
  try {
    privyClaims = await verifyPrivyToken(privyToken);
  } catch {
    return NextResponse.json({ error: 'Invalid Privy token' }, { status: 401 });
  }

  let privyUser: User;
  try {
    privyUser = await getPrivyUser(privyClaims.userId);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 502 },
    );
  }

  // Verify embedded wallet exists (created client-side by useEnsureEmbeddedWallet)
  const embeddedWallet = extractEmbeddedWallet(privyUser);
  if (!embeddedWallet) {
    return NextResponse.json(
      { error: 'Embedded wallet not found. Please try logging in again.' },
      { status: 422 },
    );
  }

  const mwUrl = `${clientEnv.MW_URL}/privy/check-wallet`;
  let res: Response;
  try {
    res = await fetch(mwUrl, {
      headers: { Authorization: `Bearer ${privyToken}` },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to connect to backend' },
      { status: 502 },
    );
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: 'Token exchange failed' },
      { status: res.status >= 500 ? 502 : res.status },
    );
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid response from backend' },
      { status: 502 },
    );
  }

  const parsed = checkWalletResponseSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid response format from backend' },
      { status: 502 },
    );
  }

  let identity: { displayName: string; identityType: string } | null = null;
  try {
    identity = getDisplayName(privyUser, loginMethod);
  } catch {
    // Display name resolution is non-critical
  }

  const session = await getSession();
  session.apiToken = parsed.data.token;
  session.expiresAt = Date.now() + SESSION_EXPIRY;
  session.isExpert = parsed.data.cryptoNative;
  session.privyDid = privyClaims.userId;
  if (identity) {
    session.displayName = identity.displayName;
    session.identityType = identity.identityType;
  }
  await session.save();

  return NextResponse.json(toSessionPayload(session));
};

export const DELETE = async (): Promise<NextResponse> => {
  const session = await getSession();
  session.destroy();
  return NextResponse.json({ ok: true });
};

export const GET = async (): Promise<NextResponse> => {
  const session = await getSession();
  const isExpired =
    session.expiresAt !== undefined && session.expiresAt <= Date.now();

  if (isExpired) session.destroy();

  return NextResponse.json(toSessionPayload(isExpired ? {} : session));
};
