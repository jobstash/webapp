import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { getIronSession } from 'iron-session';

import { CLIENT_ENVS } from '@/lib/shared/core/client.env';
import { SESSION_OPTIONS } from '@/lib/shared/core/constants.server';
import {
  getUserCredentialsResponseSchema,
  SessionSchema,
  syncSessionPayloadSchema,
} from '@/lib/auth/core/schemas';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

export const POST = async (req: NextRequest) => {
  const payload = await req.json().catch(() => null);
  if (!payload) {
    // TODO: add logs, sentry
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid JSON body',
      },
      { status: 400 },
    );
  }

  const parsedPayload = syncSessionPayloadSchema.safeParse(payload);
  if (!parsedPayload.success) {
    // TODO: add logs, sentry
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid payload',
      },
      { status: 400 },
    );
  }

  const url = `${CLIENT_ENVS.MW_URL}/privy/check-wallet`;
  const response = await kyFetch.get(url, {
    headers: {
      Authorization: `Bearer ${parsedPayload.data.privyToken}`,
    },
  });
  const jsonData = await response.json();

  const parsedResponse = getUserCredentialsResponseSchema.safeParse(jsonData);

  if (!parsedResponse.success) {
    // TODO: add logs, sentry
    throw new Error('Failed to parse user credentials');
  }

  if (!parsedResponse.data?.success) {
    // TODO: add logs, sentry
    throw new Error('Failed to get user credentials');
  }

  const reqCookies = await cookies();
  const session = await getIronSession<SessionSchema>(reqCookies, SESSION_OPTIONS);
  session.user = {
    name: 'TODO: Session Name',
    token: parsedResponse.data.data.token,
    permissions: parsedResponse.data.data.permissions,
  };
  await session.save();

  return NextResponse.json({
    success: true,
    message: 'User logged out successfully',
  });
};
