'use client';

import { useRef } from 'react';

import { usePrivy } from '@privy-io/react-auth';
import { useQuery } from '@tanstack/react-query';

import type { SessionData } from '@/features/auth/constants';
import { SESSION_KEY, fetchSession } from '@/features/auth/constants';
import { createSession } from '@/features/auth/lib/create-session';

import { useLogout } from './use-logout';

const REFRESH_BUFFER = 15 * 60 * 1000; // 15 minutes
const MIN_REFETCH_INTERVAL = 60 * 1000; // 1 minute

export const useSession = () => {
  const { isLoggingOut, logout } = useLogout();
  const { getAccessToken } = usePrivy();

  // Stable ref so queryFn closure doesn't depend on Privy re-renders
  const getAccessTokenRef = useRef(getAccessToken);
  getAccessTokenRef.current = getAccessToken;

  // Track whether we ever had a valid session (prevents redirect for first-time visitors)
  const hadSessionRef = useRef(false);

  const { data: session, isPending } = useQuery({
    queryKey: SESSION_KEY,
    queryFn: async (): Promise<SessionData> => {
      // Try fetching existing server session first
      const existing = await fetchSession();
      if (existing.apiToken) {
        hadSessionRef.current = true;
        return existing;
      }

      // No server session — try creating one from Privy token.
      // This can fail (e.g. 422 if wallet not created yet), so fall back
      // to the empty session rather than throwing into react-query retry.
      const privyToken = await getAccessTokenRef.current();

      // Session expired + Privy desynced + previously had a session → unrecoverable
      if (!privyToken && hadSessionRef.current) {
        window.location.href = '/login';
        return existing;
      }

      if (!privyToken) return existing;

      try {
        const created = await createSession(privyToken);
        if (created.apiToken) hadSessionRef.current = true;
        return created;
      } catch {
        return existing;
      }
    },
    enabled: !isLoggingOut,
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
    refetchOnWindowFocus: true,
    refetchInterval: (query): number | false => {
      const data = query.state.data;
      if (!data?.expiresAt) return false;

      const delay = data.expiresAt - REFRESH_BUFFER - Date.now();
      if (delay <= 0) return MIN_REFETCH_INTERVAL;
      return delay;
    },
  });

  const apiToken = session?.apiToken ?? null;

  return {
    apiToken,
    isExpert: session?.isExpert ?? null,
    displayName: session?.displayName ?? null,
    identityType: session?.identityType ?? null,
    isAuthenticated: apiToken !== null,
    isSessionReady: apiToken !== null,
    isLoading: isPending,
    isLoggingOut,
    logout,
  };
};
