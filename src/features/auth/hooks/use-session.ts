'use client';

import { useState } from 'react';

import { usePrivy } from '@privy-io/react-auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface SessionResponse {
  apiToken: string | null;
  expiresAt: number | null;
}

const SESSION_KEY = ['session'];
const STALE_TIME = 5 * 60 * 1000;
const REFRESH_BUFFER = 15 * 60 * 1000;

const fetchSession = async (): Promise<SessionResponse> => {
  const res = await fetch('/api/auth/session');
  if (!res.ok) throw new Error(`GET /api/auth/session failed: ${res.status}`);
  return (await res.json()) as SessionResponse;
};

const createSession = async (privyToken: string): Promise<SessionResponse> => {
  const res = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { Authorization: `Bearer ${privyToken}` },
  });
  if (!res.ok) throw new Error(`POST /api/auth/session failed: ${res.status}`);
  return (await res.json()) as SessionResponse;
};

export const useSession = () => {
  const {
    ready,
    authenticated,
    getAccessToken,
    logout: privyLogout,
  } = usePrivy();
  const queryClient = useQueryClient();

  const isAuthenticated = ready && authenticated;

  const { data: session, isPending } = useQuery({
    queryKey: SESSION_KEY,
    queryFn: async () => {
      const current = await fetchSession();

      const isExpiringSoon =
        current.expiresAt !== null &&
        current.expiresAt - Date.now() < REFRESH_BUFFER;

      if (current.apiToken && !isExpiringSoon) return current;

      const privyToken = await getAccessToken();
      if (!privyToken) throw new Error('No Privy access token');
      return createSession(privyToken);
    },
    enabled: isAuthenticated,
    staleTime: STALE_TIME,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
    refetchOnWindowFocus: true,
    refetchInterval: (query) => {
      const expiresAt = query.state.data?.expiresAt;
      if (!expiresAt) return false;
      const delay = expiresAt - REFRESH_BUFFER - Date.now();
      return delay > 0 ? delay : 1000;
    },
  });

  const apiToken = session?.apiToken ?? null;
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async (): Promise<void> => {
    setIsLoggingOut(true);
    await fetch('/api/auth/session', { method: 'DELETE' });
    queryClient.setQueryData(SESSION_KEY, {
      apiToken: null,
      expiresAt: null,
    });
    await privyLogout();
    window.location.href = '/';
  };

  return {
    apiToken,
    isAuthenticated,
    isSessionReady: apiToken !== null,
    isLoading: isAuthenticated && isPending,
    isLoggingOut,
    logout,
  };
};
