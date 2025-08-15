import { queryOptions } from '@tanstack/react-query';

import { checkNetwork } from '@/lib/shared/data';

export const SHARED_QUERIES = {
  all: ['all'],
  checkNetwork: () =>
    queryOptions({
      queryKey: [...SHARED_QUERIES.all, 'checkNetwork'],
      queryFn: checkNetwork,
      staleTime: 1000 * 60, // 1 minute
    }),
} as const;
