import { infiniteQueryOptions } from '@tanstack/react-query';

import { SHARED_QUERY_KEYS } from '@/lib/shared/core/query-keys';
import { JobListPageSchema } from '@/lib/jobs/core/schemas';

import { createParamsQueryKey } from '@/lib/shared/utils/create-params-query-key';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

export const JOBS_QUERIES = {
  all: [...SHARED_QUERY_KEYS.all, 'jobs'],
  list: (searchParams: Record<string, string>, startPage: number) =>
    infiniteQueryOptions({
      queryKey: [
        ...JOBS_QUERIES.all,
        'list',
        createParamsQueryKey(searchParams),
        startPage,
      ],
      queryFn: async ({ pageParam = startPage }) => {
        // Construct URL with query parameters
        const query = new URLSearchParams({
          page: pageParam.toString(),
          ...searchParams,
        });

        const url = `/api/jobs/list?${query.toString()}`;
        const response = await kyFetch(url).json<JobListPageSchema>();
        return response;
      },
      getNextPageParam: ({ page, hasNextPage }) => (hasNextPage ? page + 1 : undefined),
      initialPageParam: startPage,
    }),
} as const;
