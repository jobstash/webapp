'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import { usePrivy } from '@privy-io/react-auth';
import { useQueryClient } from '@tanstack/react-query';
import { createActorContext } from '@xstate/react';
import { fromPromise } from 'xstate';

import { SHARED_QUERIES } from '@/lib/shared/core/query-keys';
import { AUTH_QUERIES } from '@/lib/auth/core/queries';

import { logoutSession, syncSession } from '@/lib/auth/data';

import { authMachine } from '@/lib/auth/machines/auth.machine';

export const AuthMachineContext = createActorContext(authMachine);

export const AuthMachineProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const {
    logout: logoutPrivy,
    getAccessToken,
    authenticated: isPrivyAuthenticated,
  } = usePrivy();

  const getUserFn = useCallback(async () => {
    try {
      const user = await queryClient.fetchQuery(AUTH_QUERIES.getUser());
      return user;
    } catch (error) {
      // TODO: log error, send to sentry
      console.error('Failed to get user', error);
      throw error;
    }
  }, [queryClient]);

  const getPrivyTokenFn = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) throw new Error('No Privy token found');
    return token;
  }, [getAccessToken]);

  const logoutPrivyFn = useCallback(async () => {
    if (!isPrivyAuthenticated) return;
    await logoutPrivy();
  }, [isPrivyAuthenticated, logoutPrivy]);

  const logoutSessionFn = useCallback(async () => {
    try {
      await logoutSession();
      queryClient.clear();
      await queryClient.invalidateQueries({
        queryKey: SHARED_QUERIES.all,
      });
    } catch (error) {
      // TODO: log error, send to sentry
      console.error('Failed to logout session', error);
      throw error;
    }
  }, [queryClient]);

  const syncSessionFn = useCallback(
    async ({ input }: { input: { privyToken: string } }) => {
      try {
        await syncSession(input.privyToken);
        await queryClient.invalidateQueries({
          queryKey: SHARED_QUERIES.all,
        });
      } catch (error) {
        // TODO: log error, send to sentry
        console.error('Failed to sync session', error);
        throw error;
      }
    },
    [queryClient],
  );

  const router = useRouter();
  const navigateFn = useCallback(
    async ({ input }: { input: { path: string } }) => {
      router.push(input.path);
    },
    [router],
  );

  const configuredMachine = useMemo(() => {
    return authMachine.provide({
      actors: {
        getUser: fromPromise(getUserFn),
        getPrivyToken: fromPromise(getPrivyTokenFn),
        logoutPrivy: fromPromise(logoutPrivyFn),
        logoutSession: fromPromise(logoutSessionFn),
        syncSession: fromPromise(syncSessionFn),
        navigate: fromPromise(navigateFn),
      },
    });
  }, [
    getPrivyTokenFn,
    getUserFn,
    logoutPrivyFn,
    logoutSessionFn,
    syncSessionFn,
    navigateFn,
  ]);

  return (
    <AuthMachineContext.Provider logic={configuredMachine}>
      {children}
    </AuthMachineContext.Provider>
  );
};

export const useAuthSelector = AuthMachineContext.useSelector;
export const useAuthActorRef = AuthMachineContext.useActorRef;
