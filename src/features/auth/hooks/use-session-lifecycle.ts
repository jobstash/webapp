'use client';

import { useEffect } from 'react';

import { usePrivy, useUser } from '@privy-io/react-auth';
import { useQueryClient } from '@tanstack/react-query';

import type { SessionData } from '@/features/auth/constants';
import { SESSION_KEY } from '@/features/auth/constants';

import { useEnsureEmbeddedWallet } from './use-ensure-embedded-wallet';
import { clearLogoutPending, getLogoutPending } from './use-logout';

const REFRESH_BUFFER = 15 * 60 * 1000;

const createSession = async (privyToken: string): Promise<SessionData> => {
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
  return (await res.json()) as SessionData;
};

export const useSessionLifecycle = (isLoggingOut: boolean) => {
  const { ready, authenticated, getAccessToken } = usePrivy();
  const { refreshUser } = useUser();
  const queryClient = useQueryClient();
  const { isWalletReady, isWalletError } = useEnsureEmbeddedWallet();

  const isAuthenticated = ready && authenticated;

  // Session creation / refresh effect
  useEffect(() => {
    if (
      !isAuthenticated ||
      isLoggingOut ||
      getLogoutPending() ||
      !isWalletReady
    )
      return;

    const cached = queryClient.getQueryData<SessionData>(SESSION_KEY);

    const isExpiringSoon =
      cached?.expiresAt !== null &&
      cached?.expiresAt !== undefined &&
      cached.expiresAt - Date.now() < REFRESH_BUFFER;

    // If session exists and isn't expiring, nothing to do
    if (cached?.apiToken && !isExpiringSoon) return;

    const refresh = async (): Promise<void> => {
      const privyToken = await getAccessToken();
      if (!privyToken) return;

      const session = await createSession(privyToken);
      clearLogoutPending();
      queryClient.setQueryData(SESSION_KEY, session);
      void refreshUser();
    };

    void refresh();
  }, [
    isAuthenticated,
    isLoggingOut,
    isWalletReady,
    queryClient,
    getAccessToken,
    refreshUser,
  ]);

  // Auto-refresh before token expiry
  useEffect(() => {
    if (!isAuthenticated || isLoggingOut) return;

    const cached = queryClient.getQueryData<SessionData>(SESSION_KEY);
    if (!cached?.expiresAt) return;

    const delay = cached.expiresAt - REFRESH_BUFFER - Date.now();
    if (delay <= 0) return;

    const timer = setTimeout(() => {
      const refresh = async (): Promise<void> => {
        const privyToken = await getAccessToken();
        if (!privyToken) return;

        const session = await createSession(privyToken);
        queryClient.setQueryData(SESSION_KEY, session);
      };

      void refresh();
    }, delay);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoggingOut, queryClient, getAccessToken]);

  return { isWalletError };
};
