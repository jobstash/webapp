'use client';

import { useEffect, useState } from 'react';

import { usePrivy } from '@privy-io/react-auth';
import { useQueryClient } from '@tanstack/react-query';

import { EMPTY_SESSION, SESSION_KEY } from '@/features/auth/constants';

const LOGOUT_KEY = 'jobstash:logout-pending';

// Module-level flag shared across ALL hook instances.
// React state is per-instance, so a single setIsLoggingOut(true) only
// affects the component that called logout(). Other components keep
// firing refetch → re-creating the session. This module-level flag
// ensures every instance sees the logout immediately.
let logoutPending =
  typeof window !== 'undefined' && localStorage.getItem(LOGOUT_KEY) === '1';

export const getLogoutPending = (): boolean =>
  logoutPending || localStorage.getItem(LOGOUT_KEY) === '1';

export const clearLogoutPending = (): void => {
  logoutPending = false;
  localStorage.removeItem(LOGOUT_KEY);
};

export const useLogout = () => {
  const { ready, authenticated, logout: privyLogout } = usePrivy();
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(() => logoutPending);

  // Clear the logout flag once Privy confirms it's fully logged out.
  // Without this, the flag blocks session creation permanently — including
  // on a subsequent login attempt (deadlock).
  useEffect(() => {
    if (ready && !authenticated && logoutPending) {
      clearLogoutPending();
      setIsLoggingOut(false);
    }
  }, [ready, authenticated]);

  const logout = async (): Promise<void> => {
    logoutPending = true;
    setIsLoggingOut(true);
    localStorage.setItem(LOGOUT_KEY, '1');
    queryClient.setQueryData(SESSION_KEY, EMPTY_SESSION);
    try {
      await fetch('/api/auth/session', { method: 'DELETE' });
      await privyLogout();
    } finally {
      window.location.href = '/';
    }
  };

  return {
    isLoggingOut: isLoggingOut || logoutPending,
    logout,
  };
};
