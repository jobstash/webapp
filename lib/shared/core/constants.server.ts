import 'server-only';

export const SESSION_OPTIONS = {
  password: process.env.SESSION_PWD!,
  cookieName: 'session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 2, // 2 hrs
    path: '/',
  },
} as const;
