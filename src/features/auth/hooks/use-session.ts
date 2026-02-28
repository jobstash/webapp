'use client';

import { useQuery } from '@tanstack/react-query';

import { SESSION_KEY, fetchSession } from '@/features/auth/constants';

import { useLogout } from './use-logout';
import { useSessionLifecycle } from './use-session-lifecycle';

export const useSession = () => {
  const { isLoggingOut, logout } = useLogout();

  const { data: session, isPending } = useQuery({
    queryKey: SESSION_KEY,
    queryFn: fetchSession,
    enabled: !isLoggingOut,
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
    refetchOnWindowFocus: true,
  });

  const { isWalletError } = useSessionLifecycle(isLoggingOut);

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
    isWalletError,
    logout,
  };
};
