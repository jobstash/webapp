'use client';

export const SESSION_KEY = ['session'];

export interface SessionData {
  apiToken: string | null;
  expiresAt: number | null;
  isExpert: boolean | null;
  displayName: string | null;
  identityType: string | null;
}

export const EMPTY_SESSION: SessionData = {
  apiToken: null,
  expiresAt: null,
  isExpert: null,
  displayName: null,
  identityType: null,
};

export const fetchSession = async (): Promise<SessionData> => {
  const res = await fetch('/api/auth/session');
  if (!res.ok) throw new Error(`GET /api/auth/session failed: ${res.status}`);
  return (await res.json()) as SessionData;
};
