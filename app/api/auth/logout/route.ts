import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getIronSession } from 'iron-session';

import { SESSION_OPTIONS } from '@/lib/shared/core/constants';
import { SessionSchema } from '@/lib/auth/core/schemas';

export const POST = async () => {
  const reqCookies = await cookies();
  const session = await getIronSession<SessionSchema>(reqCookies, SESSION_OPTIONS);

  session.destroy();

  return NextResponse.json({
    success: true,
    message: 'User logged out successfully',
  });
};
