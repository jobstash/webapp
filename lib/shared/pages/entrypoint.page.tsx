'use client';
import { useQueryClient } from '@tanstack/react-query';
import { useMachine } from '@xstate/react';
import { fromPromise } from 'xstate';

import { LS_KEYS } from '@/lib/shared/core/constants';
import { SHARED_QUERIES } from '@/lib/shared/core/query-keys';

import { entrypointMachine } from '@/lib/shared/machines';

export const EntrypointPage = ({ children }: React.PropsWithChildren) => {
  const queryClient = useQueryClient();

  const checkNetworkFn = async () => {
    await queryClient.fetchQuery(SHARED_QUERIES.checkNetwork());
  };

  const checkVersionFn = async () => {
    try {
      const current = localStorage.getItem(LS_KEYS.CURRENT_VERSION) || '0.0.0';
      const result = await queryClient.fetchQuery(SHARED_QUERIES.checkVersion(current));
      const serverVersion = result.version;
      if (serverVersion !== current) {
        localStorage.setItem(LS_KEYS.CURRENT_VERSION, serverVersion);
      }
      return result;
    } catch (error) {
      // TODO: log error, send to sentry
      console.error('Failed to check version', error);
      throw error;
    }
  };

  const [snapshot] = useMachine(
    entrypointMachine.provide({
      actors: {
        checkNetwork: fromPromise(checkNetworkFn),
        checkVersion: fromPromise(checkVersionFn),
      },
    }),
  );

  if (snapshot.matches('checkingNetwork') || snapshot.matches('checkingVersion')) {
    return <p>TODO: Loading Page</p>;
  }

  if (snapshot.matches('offline')) {
    return <p>TODO: Offline Page</p>;
  }

  if (snapshot.matches('maintenance')) {
    return <p>TODO: Maintenance Page</p>;
  }

  if (snapshot.matches('forceReload')) {
    return <p>TODO: Force Reload Page</p>;
  }

  if (snapshot.matches('forceLogout')) {
    return <p>TODO: Force Logout Page</p>;
  }

  if (snapshot.matches('updateNudge')) {
    return <p>TODO: Update Nudge Page</p>;
  }

  if (snapshot.matches('error')) {
    return <p>TODO: Error Page</p>;
  }

  if (snapshot.matches('ready')) {
    return (
      <>
        {snapshot.context.showUpdateNudge && <p>TODO: Update Nudge Page</p>}
        {children}
      </>
    );
  }

  return <p>TODO: Unknown State</p>;
};
