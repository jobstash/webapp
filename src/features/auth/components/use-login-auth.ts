'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from '@bprogress/next/app';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import { useQueryClient } from '@tanstack/react-query';

import { useProfileCompleteness } from '@/features/profile/hooks/use-profile-completeness';
import { markSignInReturn } from '../lib/return-navigation';
import { GA_EVENT, trackEvent } from '@/lib/analytics';
import { SESSION_KEY } from '@/features/auth/constants';
import { useSession } from '@/features/auth/hooks/use-session';
import { createSession } from '@/features/auth/lib/create-session';

export const useLoginAuth = (redirectTo: string, destinationReady: boolean) => {
  const {
    isAuthenticated,
    privyDid,
    isLoading: isSessionLoading,
    hasVerifiedEmail,
  } = useSession();
  const { ready, authenticated, user, getAccessToken } = usePrivy();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [sessionError, setSessionError] = useState(false);
  const exchange = useRef<Promise<void> | null>(null);
  const navigated = useRef(false);
  const currentIdentity = useRef(user?.id);
  currentIdentity.current = user?.id;
  const identityMatches = Boolean(user && privyDid === user.id);

  // A valid cookie may still belong to the account used before this login.
  // Share the exchange between the login callback and session recovery.
  const finishSignIn = useCallback(
    (loginMethod?: string | null): Promise<void> => {
      if (exchange.current) return exchange.current;
      setIsLoggingIn(true);
      setSessionError(false);
      const request = (async () => {
        try {
          const token = await getAccessToken();
          if (!token) throw new Error('No Privy access token');
          const session = await createSession(token, loginMethod);
          if (
            !session.apiToken ||
            !session.privyDid ||
            (currentIdentity.current &&
              session.privyDid !== currentIdentity.current)
          ) {
            throw new Error('The session does not match the signed-in account');
          }
          queryClient.removeQueries({ queryKey: ['profile-skills'] });
          queryClient.removeQueries({ queryKey: ['profile-showcase'] });
          queryClient.setQueryData(SESSION_KEY, session);
        } catch (error) {
          setSessionError(true);
          throw error;
        } finally {
          exchange.current = null;
          setIsLoggingIn(false);
        }
      })();
      exchange.current = request;
      return request;
    },
    [getAccessToken, queryClient],
  );

  useEffect(() => {
    if (
      ready &&
      authenticated &&
      user &&
      !identityMatches &&
      !isSessionLoading &&
      !isLoggingIn &&
      !sessionError
    ) {
      void finishSignIn().catch(() => {});
    }
  }, [
    ready,
    authenticated,
    user,
    identityMatches,
    isSessionLoading,
    isLoggingIn,
    sessionError,
    finishSignIn,
  ]);

  const canCheckProfile =
    destinationReady &&
    ready &&
    authenticated &&
    identityMatches &&
    isAuthenticated &&
    hasVerifiedEmail === true &&
    !isLoggingIn &&
    !sessionError;
  const profile = useProfileCompleteness({
    enabled: canCheckProfile,
    fresh: true,
  });

  useEffect(() => {
    if (
      !canCheckProfile ||
      profile.isPending ||
      profile.isError ||
      navigated.current
    )
      return;
    navigated.current = true;
    markSignInReturn(redirectTo, profile.isComplete ? 'returning' : 'setup');
    router.replace(
      profile.isComplete
        ? redirectTo
        : `/profile/settings?setup=1&redirect=${encodeURIComponent(redirectTo)}`,
      { scroll: !profile.isComplete },
    );
  }, [
    canCheckProfile,
    profile.isPending,
    profile.isError,
    profile.isComplete,
    redirectTo,
    router,
  ]);

  const { login } = useLogin({
    onComplete: async ({ wasAlreadyAuthenticated, loginMethod }) => {
      if (!wasAlreadyAuthenticated)
        trackEvent(GA_EVENT.LOGIN_COMPLETED, {
          login_method: loginMethod ?? 'unknown',
        });
      await finishSignIn(loginMethod).catch(() => {});
    },
    onError: () => {
      setIsLoggingIn(false);
    },
  });

  return {
    login,
    cancelRedirect: () => {
      navigated.current = true;
    },
    sessionError,
    retrySession: () => {
      void finishSignIn().catch(() => {});
    },
    profileError: canCheckProfile && profile.isError,
    retryProfile: profile.retry,
    isLoading:
      !sessionError &&
      (!destinationReady ||
        !ready ||
        isSessionLoading ||
        isLoggingIn ||
        (authenticated &&
          (!identityMatches ||
            (hasVerifiedEmail === true && !profile.isError)))),
  };
};
