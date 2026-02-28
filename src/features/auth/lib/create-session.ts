import type { SessionData } from '@/features/auth/constants';

export const createSession = async (
  privyToken: string,
): Promise<SessionData> => {
  const loginMethod = localStorage.getItem('jobstash:last-auth-method');
  const res = await fetch('/api/auth/session', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${privyToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ loginMethod }),
  });
  if (!res.ok) throw new Error(`POST /api/auth/session failed: ${res.status}`);
  return (await res.json()) as SessionData;
};
