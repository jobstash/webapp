'use client';

import { useEffect } from 'react';

import { usePrivy } from '@privy-io/react-auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { ELIGIBILITY_KEY } from '@/hooks/use-eligibility';

interface SessionResponse {
  apiToken: string | null;
  expiresAt: number | null;
  isExpert: boolean | null;
  displayName: string | null;
  identityType: string | null;
  isLoggingOut?: boolean;
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

  const {
    data: session,
    isPending,
    refetch,
  } = useQuery({
    queryKey: SESSION_KEY,
    queryFn: async () => {
      const current = await fetchSession();
      const isExpiringSoon =
        current.expiresAt !== null &&
        current.expiresAt - Date.now() < REFRESH_BUFFER;

      if (current.apiToken && !isExpiringSoon) return current;

      if (!ready || !authenticated) {
        if (current.apiToken) return current;
        return {
          apiToken: null,
          expiresAt: null,
          isExpert: null,
          displayName: null,
          identityType: null,
        };
      }

      const privyToken = await getAccessToken();
      if (!privyToken) throw new Error('No Privy access token');
      const session = await createSession(privyToken);
      void queryClient.invalidateQueries({ queryKey: ELIGIBILITY_KEY });
      return session;
    },
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

  // Refetch when Privy becomes authenticated but session has no token
  useEffect(() => {
    if (isAuthenticated && !apiToken) {
      void refetch();
    }
  }, [isAuthenticated, apiToken, refetch]);

  const logout = async (): Promise<void> => {
    queryClient.setQueryData(SESSION_KEY, {
      apiToken: null,
      expiresAt: null,
      isExpert: null,
      displayName: null,
      identityType: null,
      isLoggingOut: true,
    });
    await fetch('/api/auth/session', { method: 'DELETE' });
    await privyLogout();
    window.location.href = '/';
  };

  const isSessionReady = apiToken !== null;

  return {
    apiToken,
    isExpert: session?.isExpert ?? null,
    displayName: session?.displayName ?? null,
    identityType: session?.identityType ?? null,
    isAuthenticated,
    isSessionReady,
    isLoading: isPending,
    isLoggingOut: session?.isLoggingOut ?? false,
    logout,
  };
};
