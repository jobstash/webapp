'use client';

import { useEffect, useTransition } from 'react';

import { useRouter } from '@bprogress/next/app';
import { useSearchParams } from 'next/navigation';

import { useLoginWithOAuth, usePrivy } from '@privy-io/react-auth';

import { useSession } from '@/features/auth/hooks/use-session';

export const useLoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isNavigating, startTransition] = useTransition();

  const { ready, authenticated } = usePrivy();
  const { loading: isOAuthLoading } = useLoginWithOAuth();
  const { isSessionReady } = useSession();

  const redirectTo = searchParams.get('redirect') ?? '/';

  // Show spinner to avoid flashing login UI during auth processing
  const isLoading =
    !ready || // SDK still initializing, can't determine auth state
    isOAuthLoading || // Privy is exchanging OAuth code for tokens
    authenticated || // Already logged in, waiting for session before redirect
    (typeof window !== 'undefined' &&
      /[?&]privy_oauth_/.test(window.location.search)); // First render before useLoginWithOAuth reports loading

  useEffect(() => {
    if (ready && authenticated && isSessionReady) {
      startTransition(() => {
        router.replace(redirectTo);
      });
    }
  }, [ready, authenticated, isSessionReady, redirectTo, router]);

  const handleBack = () => {
    startTransition(() => {
      router.push(redirectTo);
    });
  };

  return {
    isLoading,
    isNavigating,
    redirectTo,
    handleBack,
  };
};
