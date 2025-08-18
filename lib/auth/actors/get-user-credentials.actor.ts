import type { QueryClient } from '@tanstack/react-query';
import { fromPromise } from 'xstate';

import { AUTH_QUERIES } from '@/lib/auth/core/queries';

interface Props {
  input: {
    privyToken: string;
    queryClient: QueryClient;
  };
}

export const getUserCredentialsActor = fromPromise(async ({ input }: Props) => {
  try {
    const userCredentials = await input.queryClient.fetchQuery(
      AUTH_QUERIES.getUserCredentials(input.privyToken),
    );
    return userCredentials;
  } catch (error) {
    // TODO: add logs, sentry
    throw new Error(
      error instanceof Error ? error.message : 'Failed to get user credentials',
    );
  }
});
