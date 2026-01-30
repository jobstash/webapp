'use client';

import { useEffect } from 'react';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

import { useApiToken } from './use-api-token';

export const useProfileContent = () => {
  const router = useRouter();
  const { ready, authenticated, user, logout } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.replace('/onboarding');
    }
  }, [ready, authenticated, router]);

  const {
    apiToken,
    isPending: isTokenPending,
    isError: isTokenError,
    error: tokenError,
  } = useApiToken();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.replace('/');
    }
  };

  return {
    isLoading: !ready,
    isAuthenticated: ready && authenticated,
    user,
    apiToken,
    isTokenPending,
    isTokenError,
    tokenError,
    handleLogout,
  };
};
