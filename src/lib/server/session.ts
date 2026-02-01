import 'server-only';

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

import { serverEnv } from '@/lib/env/server';

export interface SessionData {
  apiToken?: string;
  expiresAt?: number; // Unix timestamp (ms) when API token expires
  isExpert?: boolean;
}

const SESSION_OPTIONS = {
  password: serverEnv.SESSION_SECRET,
  cookieName: 'jobstash-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60, // 1 hour (matches API token TTL)
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), SESSION_OPTIONS);
}
