import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getIronSession } from 'iron-session';

import { SESSION_OPTIONS } from '@/lib/shared/core/constants.server';
import { SessionSchema } from '@/lib/auth/core/schemas';

export const POST = async () => {
  const reqCookies = await cookies();
  const session = await getIronSession<SessionSchema>(reqCookies, SESSION_OPTIONS);

  if (!session.user) {
    // TODO: Log error, send to sentry
    return NextResponse.json(
      { success: false, message: 'No active session' },
      { status: 401 },
    );
  }

  // TODO: Send CV to API

  await new Promise((r) => setTimeout(r, 2000));
  return NextResponse.json({
    success: true,
    message: 'CV sent',
    data: {
      showCvUpload: false,
      showRequiredInfo: true,
    },
  });
};
