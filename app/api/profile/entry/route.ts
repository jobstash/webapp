import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getIronSession } from 'iron-session';

import { SESSION_OPTIONS } from '@/lib/shared/core/constants.server';
import { SessionSchema } from '@/lib/auth/core/schemas';

export const GET = async () => {
  const reqCookies = await cookies();
  const session = await getIronSession<SessionSchema>(reqCookies, SESSION_OPTIONS);

  if (!session.user) {
    // TODO: Log error, send to sentry
    return NextResponse.json(
      { success: false, message: 'No active session' },
      { status: 401 },
    );
  }

  // TODO: Check if user has CV
  // TODO: Check if user has required info

  await new Promise((resolve) => setTimeout(resolve, 2000));
  return NextResponse.json({
    success: true,
    message: 'Profile entry check successful',
    data: {
      showCvUpload: true,
      showRequiredInfo: true,
    },
  });
};
