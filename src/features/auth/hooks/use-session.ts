'use client';

import { useEffect } from 'react';

import { usePrivy } from '@privy-io/react-auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface SessionResponse {
  apiToken: string | null;
  expiresAt: number | null;
  isExpert: boolean | null;
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
      console.log(
        `[DEBUG:useSession][${new Date().toISOString()}] queryFn called, ready=${String(ready)}, authenticated=${String(authenticated)}`,
      );

      // Phase 1: Read iron-session cookie (no Privy dependency)
      const current = await fetchSession();
      const isExpiringSoon =
        current.expiresAt !== null &&
        current.expiresAt - Date.now() < REFRESH_BUFFER;

      console.log(
        `[DEBUG:useSession][${new Date().toISOString()}] phase1: hasToken=${String(!!current.apiToken)}, expiresAt=${String(current.expiresAt)}, isExpiringSoon=${String(isExpiringSoon)}`,
      );

      if (current.apiToken && !isExpiringSoon) {
        console.log(
          `[DEBUG:useSession][${new Date().toISOString()}] phase1 sufficient, returning`,
        );
        return current;
      }

      // Phase 2: Need token exchange — requires Privy
      if (!ready || !authenticated) {
        console.log(
          `[DEBUG:useSession][${new Date().toISOString()}] phase2 skipped: privy not ready`,
        );
        return current.apiToken
          ? current
          : ({
              apiToken: null,
              expiresAt: null,
              isExpert: null,
            } as SessionResponse);
      }

      console.log(
        `[DEBUG:useSession][${new Date().toISOString()}] phase2: exchanging privy token`,
      );

      try {
        const privyToken = await getAccessToken();
        if (!privyToken) throw new Error('No Privy access token');
        const result = await createSession(privyToken);
        console.log(
          `[DEBUG:useSession][${new Date().toISOString()}] phase2: session created, hasToken=${String(!!result.apiToken)}`,
        );
        return result;
      } catch (error) {
        console.log(
          `[DEBUG:useSession][${new Date().toISOString()}] phase2 error: ${String(error)}`,
        );
        throw error;
      }
    },
    enabled: true,
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
      console.log(
        `[DEBUG:useSession][${new Date().toISOString()}] effect: isAuthenticated=${String(isAuthenticated)}, hasToken=${String(!!apiToken)}, triggering refetch`,
      );
      void refetch();
    }
  }, [isAuthenticated, apiToken, refetch]);

  const logout = async (): Promise<void> => {
    queryClient.setQueryData(SESSION_KEY, {
      apiToken: null,
      expiresAt: null,
      isExpert: null,
      isLoggingOut: true,
    });
    await fetch('/api/auth/session', { method: 'DELETE' });
    await privyLogout();
    window.location.href = '/';
  };

  const isSessionReady = apiToken !== null;

  console.log(
    `[DEBUG:useSession][${new Date().toISOString()}] returning: isSessionReady=${String(isSessionReady)}, isPending=${String(isPending)}`,
  );

  return {
    apiToken,
    isExpert: session?.isExpert ?? null,
    isAuthenticated,
    isSessionReady,
    isLoading: isPending,
    isLoggingOut: session?.isLoggingOut ?? false,
    logout,
  };
};
