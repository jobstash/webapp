import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { clientEnv } from '@/lib/env/client';
import { getPrivyUser, verifyPrivyToken } from '@/lib/server/privy';
import { getSession } from '@/lib/server/session';
import { getDisplayName } from '@/features/auth/server/get-display-name';

const SESSION_EXPIRY = 55 * 60 * 1000; // 55 min (safety margin under 1hr Privy token TTL)

const checkWalletResponseSchema = z.object({
  token: z.string().min(1),
  cryptoNative: z.boolean(),
});

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const authHeader = req.headers.get('authorization') ?? '';
  const privyToken = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : '';

  if (!privyToken) {
    return NextResponse.json({ error: 'No Privy token' }, { status: 401 });
  }

  let privyClaims: Awaited<ReturnType<typeof verifyPrivyToken>>;
  try {
    privyClaims = await verifyPrivyToken(privyToken);
  } catch {
    return NextResponse.json({ error: 'Invalid Privy token' }, { status: 401 });
  }

  let res: Response;
  try {
    res = await fetch(`${clientEnv.MW_URL}/privy/check-wallet`, {
      headers: { Authorization: `Bearer ${privyToken}` },
    });
  } catch (error) {
    console.error('[POST /api/auth/session] Backend connection failed:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend' },
      { status: 502 },
    );
  }

  if (!res.ok) {
    console.error(
      `[POST /api/auth/session] Backend returned ${String(res.status)}`,
    );
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
    console.error(
      '[POST /api/auth/session] Invalid backend response:',
      parsed.error.flatten(),
    );
    return NextResponse.json(
      { error: 'Invalid response format from backend' },
      { status: 502 },
    );
  }

  let identity: { displayName: string; identityType: string } | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const privyUser = await getPrivyUser(privyClaims.userId);
      identity = getDisplayName(privyUser);
      break;
    } catch (error) {
      console.error(
        `[POST /api/auth/session] getPrivyUser attempt ${String(attempt + 1)} failed:`,
        error,
      );
    }
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

  return NextResponse.json({
    apiToken: session.apiToken,
    expiresAt: session.expiresAt,
    isExpert: session.isExpert,
    displayName: session.displayName ?? null,
    identityType: session.identityType ?? null,
  });
};

export const DELETE = async (): Promise<NextResponse> => {
  const session = await getSession();
  session.destroy();
  return NextResponse.json({ ok: true });
};

export const GET = async (): Promise<NextResponse> => {
  const session = await getSession();
  const expiresAt = session.expiresAt ?? null;
  const isExpired = expiresAt !== null && expiresAt <= Date.now();

  if (isExpired) {
    session.destroy();
    return NextResponse.json({
      apiToken: null,
      expiresAt: null,
      isExpert: null,
      displayName: null,
      identityType: null,
    });
  }

  return NextResponse.json({
    apiToken: session.apiToken ?? null,
    expiresAt,
    isExpert: session.isExpert ?? null,
    displayName: session.displayName ?? null,
    identityType: session.identityType ?? null,
  });
};
