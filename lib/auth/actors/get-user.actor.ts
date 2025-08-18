'use client';

import { QueryClient } from '@tanstack/react-query';
import { fromPromise } from 'xstate';

import { AUTH_QUERIES } from '@/lib/auth/core/queries';

interface Props {
  input: {
    queryClient: QueryClient;
  };
}

export const getUserActor = fromPromise(async ({ input }: Props) => {
  try {
    const user = await input.queryClient.fetchQuery(AUTH_QUERIES.getUser());
    return user;
  } catch (error) {
    // TODO: log error, send to sentry
    throw new Error(error instanceof Error ? error.message : 'Failed to get user');
  }
});
