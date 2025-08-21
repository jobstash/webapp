import 'server-only';

import { SERVER_ENVS } from '@/lib/shared/core/server.env';

export const SESSION_OPTIONS = {
  password: SERVER_ENVS.SESSION_PWD!,
  cookieName: 'session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 2, // 2 hrs
    path: '/',
  },
} as const;
