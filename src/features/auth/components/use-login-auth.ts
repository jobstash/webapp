'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter } from '@bprogress/next/app';

import { useLogin, usePrivy } from '@privy-io/react-auth';
import { useQueryClient } from '@tanstack/react-query';

import { GA_EVENT, trackEvent } from '@/lib/analytics';
import { SESSION_KEY } from '@/features/auth/constants';
import { useSession } from '@/features/auth/hooks/use-session';
import { createSession } from '@/features/auth/lib/create-session';

const LOGIN_TIMEOUT = 20_000;

export const useLoginAuth = (redirectTo: string) => {
  const { isAuthenticated, isLoading: isSessionLoading } = useSession();

  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    ready,
    authenticated,
    logout: privyLogout,
    getAccessToken,
  } = usePrivy();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const sessionRetried = useRef(false);

  // Redirect when useSession resolves as authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, redirectTo, router]);

  // Re-trigger session query after Privy becomes ready.
  // useSession's queryFn already tries getAccessToken() → createSession(),
  // but it may run before Privy initializes. This re-triggers it once
  // Privy is ready so the existing renewal logic gets a valid token.
  useEffect(() => {
    if (!authenticated) {
      sessionRetried.current = false;
      return;
    }
    if (
      ready &&
      !isAuthenticated &&
      !isSessionLoading &&
      !isLoggingIn &&
      !sessionRetried.current
    ) {
      sessionRetried.current = true;
      queryClient.invalidateQueries({ queryKey: SESSION_KEY });
    }
  }, [
    ready,
    authenticated,
    isAuthenticated,
    isSessionLoading,
    isLoggingIn,
    queryClient,
  ]);

  const { login } = useLogin({
    onComplete: async ({ wasAlreadyAuthenticated, loginMethod }) => {
      if (wasAlreadyAuthenticated) {
        // Privy says already authed — try to recover the server session.
        // If it works, the redirect effect handles navigation.
        // If it fails, clear stale Privy state so the modal opens next click.
        setIsLoggingIn(true);
        try {
          const privyToken = await getAccessToken();
          if (!privyToken) {
            await privyLogout();
            return;
          }
          const session = await createSession(privyToken);
          queryClient.setQueryData(SESSION_KEY, session);
        } catch {
          await privyLogout();
        } finally {
          setIsLoggingIn(false);
        }
        return;
      }

      setIsLoggingIn(true);

      const timeout = setTimeout(() => setIsLoggingIn(false), LOGIN_TIMEOUT);

      try {
        trackEvent(GA_EVENT.LOGIN_COMPLETED, {
          login_method: loginMethod ?? 'unknown',
        });

        const privyToken = await getAccessToken();
        if (!privyToken) throw new Error('No Privy access token');

        const session = await createSession(privyToken, loginMethod);
        queryClient.setQueryData(SESSION_KEY, session);
      } catch {
        setIsLoggingIn(false);
      } finally {
        clearTimeout(timeout);
      }
    },
    onError: () => {
      setIsLoggingIn(false);
    },
  });

  return {
    login,
    isLoading: !ready || isSessionLoading || isAuthenticated || isLoggingIn,
  };
};
