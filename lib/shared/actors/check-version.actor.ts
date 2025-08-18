'use client';

import { type QueryClient } from '@tanstack/react-query';
import { fromPromise } from 'xstate';

import { LS_KEYS } from '@/lib/shared/core/constants';
import { SHARED_QUERIES } from '@/lib/shared/core/query-keys';

interface Props {
  input: {
    queryClient: QueryClient;
  };
}

export const checkVersionActor = fromPromise(async ({ input }: Props) => {
  try {
    // Get the current version from local storage
    const current = localStorage.getItem(LS_KEYS.CURRENT_VERSION) || '0.0.0';

    // Fetch server version
    const result = await input.queryClient.fetchQuery(
      SHARED_QUERIES.checkVersion(current),
    );

    // Persist the current version to local storage if different
    const serverVersion = result.version;
    if (serverVersion !== current) {
      localStorage.setItem(LS_KEYS.CURRENT_VERSION, serverVersion);
    }

    return result;
  } catch (error) {
    // TODO: log error, send to sentry
    throw new Error(error instanceof Error ? error.message : 'Failed to sync version');
  }
});
