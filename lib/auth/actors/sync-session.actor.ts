import type { QueryClient } from '@tanstack/react-query';
import { fromPromise } from 'xstate';

import { SHARED_QUERIES } from '@/lib/shared/core/query-keys';

import { syncSession } from '@/lib/auth/data';

interface Props {
  input: {
    privyToken: string;
    queryClient: QueryClient;
  };
}

export const syncSessionActor = fromPromise(async ({ input }: Props) => {
  try {
    await syncSession(input.privyToken);
    await input.queryClient.invalidateQueries({
      queryKey: SHARED_QUERIES.all,
    });
  } catch (error) {
    // TODO: add logs, sentry
    throw new Error(
      error instanceof Error ? error.message : 'Failed to get user credentials',
    );
  }
});
