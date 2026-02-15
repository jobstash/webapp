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

  const hasOAuthParams =
    typeof window !== 'undefined' &&
    /[?&]privy_oauth_/.test(window.location.search);

  // Show spinner to avoid flashing login UI during auth processing
  const isLoading =
    !ready || // SDK still initializing, can't determine auth state
    isOAuthLoading || // Privy is exchanging OAuth code for tokens
    authenticated || // Already logged in, waiting for session before redirect
    hasOAuthParams; // First render before useLoginWithOAuth reports loading

  console.log(
    `[DEBUG:useLoginContent][${new Date().toISOString()}] ready=${String(ready)}, authenticated=${String(authenticated)}, isOAuthLoading=${String(isOAuthLoading)}, isSessionReady=${String(isSessionReady)}`,
  );
  console.log(
    `[DEBUG:useLoginContent][${new Date().toISOString()}] isLoading=${String(isLoading)}, hasOAuthParams=${String(hasOAuthParams)}`,
  );

  useEffect(() => {
    if (ready && authenticated && isSessionReady) {
      console.log(
        `[DEBUG:useLoginContent][${new Date().toISOString()}] redirect effect: all conditions met, redirecting to ${redirectTo}`,
      );
      startTransition(() => {
        router.replace(redirectTo);
      });
    } else {
      console.log(
        `[DEBUG:useLoginContent][${new Date().toISOString()}] redirect effect: conditions not met (ready=${String(ready)}, authenticated=${String(authenticated)}, isSessionReady=${String(isSessionReady)})`,
      );
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
