'use client';

import { useState } from 'react';

import { usePrivy } from '@privy-io/react-auth';
import { useQueryClient } from '@tanstack/react-query';

import { EMPTY_SESSION, SESSION_KEY } from '@/features/auth/constants';

const LOGOUT_KEY = 'jobstash:logout-pending';

export const useLogout = () => {
  const { logout: privyLogout } = usePrivy();
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(
    () =>
      typeof window !== 'undefined' && localStorage.getItem(LOGOUT_KEY) === '1',
  );

  const logout = async (): Promise<void> => {
    setIsLoggingOut(true);
    queryClient.cancelQueries({ queryKey: SESSION_KEY });
    queryClient.setQueryData(SESSION_KEY, EMPTY_SESSION);
    localStorage.setItem(LOGOUT_KEY, '1');

    try {
      await fetch('/api/auth/session', { method: 'DELETE' });
      await privyLogout();
    } finally {
      localStorage.removeItem(LOGOUT_KEY);
      window.location.href = '/';
    }
  };

  return {
    isLoggingOut,
    logout,
  };
};
