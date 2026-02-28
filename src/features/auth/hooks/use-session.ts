'use client';

import { useEffect, useState } from 'react';

import { usePrivy, useUser } from '@privy-io/react-auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { ELIGIBILITY_KEY } from '@/hooks/use-eligibility';

import { useEnsureEmbeddedWallet } from './use-ensure-embedded-wallet';

interface SessionResponse {
  apiToken: string | null;
  expiresAt: number | null;
  isExpert: boolean | null;
  displayName: string | null;
  identityType: string | null;
}

const SESSION_KEY = ['session'];
const STALE_TIME = 5 * 60 * 1000;
const REFRESH_BUFFER = 15 * 60 * 1000;
const LOGOUT_KEY = 'jobstash:logout-pending';

// Module-level flag shared across ALL useSession() instances.
// React state is per-instance, so a single setIsLoggingOut(true) only
// affects the component that called logout(). Other components keep
// firing refetch → re-creating the session. This module-level flag
// ensures every instance sees the logout immediately.
let logoutPending =
  typeof window !== 'undefined' && localStorage.getItem(LOGOUT_KEY) === '1';

const EMPTY_SESSION: SessionResponse = {
  apiToken: null,
  expiresAt: null,
  isExpert: null,
  displayName: null,
  identityType: null,
};

const fetchSession = async (): Promise<SessionResponse> => {
  const res = await fetch('/api/auth/session');
  if (!res.ok) throw new Error(`GET /api/auth/session failed: ${res.status}`);
  return (await res.json()) as SessionResponse;
};

const createSession = async (privyToken: string): Promise<SessionResponse> => {
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
  return (await res.json()) as SessionResponse;
};

export const useSession = () => {
  const {
    ready,
    authenticated,
    getAccessToken,
    logout: privyLogout,
  } = usePrivy();
  const { refreshUser } = useUser();
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(() => logoutPending);
  const { isWalletReady } = useEnsureEmbeddedWallet();

  const isAuthenticated = ready && authenticated;

  const {
    data: session,
    isPending,
    refetch,
  } = useQuery({
    queryKey: SESSION_KEY,
    queryFn: async () => {
      // Hard gate: if ANY instance triggered logout, bail immediately.
      // This catches races where `enabled` was evaluated before the flag was set.
      if (logoutPending || localStorage.getItem(LOGOUT_KEY) === '1') {
        return EMPTY_SESSION;
      }

      const current = await fetchSession();

      const isExpiringSoon =
        current.expiresAt !== null &&
        current.expiresAt - Date.now() < REFRESH_BUFFER;

      if (current.apiToken && !isExpiringSoon) return current;

      if (!ready) return current.apiToken ? current : EMPTY_SESSION;

      const privyToken = await getAccessToken();

      if (!authenticated && !privyToken) {
        if (current.apiToken)
          await fetch('/api/auth/session', { method: 'DELETE' });
        return EMPTY_SESSION;
      }

      if (!privyToken) throw new Error('No Privy access token');

      const refreshed = await createSession(privyToken);
      logoutPending = false;
      localStorage.removeItem(LOGOUT_KEY);
      setIsLoggingOut(false);
      void refreshUser();
      void queryClient.invalidateQueries({ queryKey: ELIGIBILITY_KEY });
      return refreshed;
    },
    enabled: !isLoggingOut && !logoutPending,
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

  // Clear the logout flag once Privy confirms it's fully logged out.
  // Without this, the flag blocks session creation permanently — including
  // on a subsequent login attempt (deadlock).
  useEffect(() => {
    if (ready && !authenticated && logoutPending) {
      logoutPending = false;
      localStorage.removeItem(LOGOUT_KEY);
      setIsLoggingOut(false);
    }
  }, [ready, authenticated]);

  useEffect(() => {
    if (
      isAuthenticated &&
      !apiToken &&
      !isLoggingOut &&
      !logoutPending &&
      isWalletReady
    )
      void refetch();
  }, [isAuthenticated, apiToken, isLoggingOut, isWalletReady, refetch]);

  const logout = async (): Promise<void> => {
    logoutPending = true;
    setIsLoggingOut(true);
    localStorage.setItem(LOGOUT_KEY, '1');
    queryClient.setQueryData(SESSION_KEY, EMPTY_SESSION);
    queryClient.setQueryData(ELIGIBILITY_KEY, EMPTY_SESSION);
    try {
      await fetch('/api/auth/session', { method: 'DELETE' });
      await privyLogout();
    } finally {
      window.location.href = '/';
    }
  };

  return {
    apiToken,
    isExpert: session?.isExpert ?? null,
    displayName: session?.displayName ?? null,
    identityType: session?.identityType ?? null,
    isAuthenticated,
    isSessionReady: apiToken !== null,
    isLoading: isPending,
    isLoggingOut: isLoggingOut || logoutPending,
    logout,
  };
};
