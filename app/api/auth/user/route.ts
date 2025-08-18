import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getIronSession } from 'iron-session';

import { SESSION_OPTIONS } from '@/lib/shared/core/constants.server';
import { SessionSchema } from '@/lib/auth/core/schemas';

export const GET = async () => {
  const reqCookies = await cookies();
  const session = await getIronSession<SessionSchema>(reqCookies, SESSION_OPTIONS);

  if (!session.user) {
    return NextResponse.json(
      { success: true, message: 'No active session', data: null },
      { status: 200 },
    );
  }

  return NextResponse.json({
    success: true,
    message: 'User fetched successfully',
    data: {
      name: 'TODO: Name',
      token: session.user.token,
      permissions: session.user.permissions,
    },
  });
};
