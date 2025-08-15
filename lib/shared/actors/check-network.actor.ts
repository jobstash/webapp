'use client';

import { type QueryClient } from '@tanstack/react-query';
import { fromPromise } from 'xstate';

import { SHARED_QUERIES } from '@/lib/shared/core/query-keys';

interface Props {
  input: {
    queryClient: QueryClient;
  };
}

export const checkNetworkActor = fromPromise(async ({ input }: Props) =>
  input.queryClient.fetchQuery(SHARED_QUERIES.checkNetwork()),
);
