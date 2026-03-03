import type { SessionData } from '@/features/auth/constants';

export const createSession = async (
  privyToken: string,
  loginMethod?: string | null,
): Promise<SessionData> => {
  const normalized =
    loginMethod === 'siwe' ? 'wallet' : (loginMethod ?? undefined);
  const res = await fetch('/api/auth/session', {
    method: 'POST',
    signal: AbortSignal.timeout(15_000),
    headers: {
      Authorization: `Bearer ${privyToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ loginMethod: normalized }),
  });
  if (!res.ok) throw new Error(`POST /api/auth/session failed: ${res.status}`);
  return (await res.json()) as SessionData;
};
