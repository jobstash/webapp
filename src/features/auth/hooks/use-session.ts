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

  const { data: session, isPending } = useQuery({
    queryKey: SESSION_KEY,
    queryFn: async (): Promise<SessionData> => {
      // Try fetching existing server session first
      const existing = await fetchSession();
      if (existing.apiToken) return existing;

      // No server session — try creating one from Privy token (silent renewal)
      const privyToken = await getAccessTokenRef.current();
      if (!privyToken) return existing;

      try {
        return await createSession(privyToken);
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
