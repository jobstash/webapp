import { useSearchParams } from 'next/navigation';

import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

import { JOBS_QUERY_KEYS } from '@/lib/jobs/core/query-keys';
import { JobListPageSchema } from '@/lib/jobs/core/schemas';

import { createParamsQueryKey } from '@/lib/shared/utils/create-params-query-key';

import { fetchJobListPage } from '@/lib/jobs/server/data';

// Start from page 2 because the first page is SSR'd and hooks are client side
const DEFAULT_START_PAGE = 2;

type TQueryFnData = JobListPageSchema;
type TError = Error;
type TData = InfiniteData<TQueryFnData, number>;
type TQueryKey = string[];
type TPageParam = number;

export const useJobListQuery = (startPage = DEFAULT_START_PAGE) => {
  const readOnlySearchParams = useSearchParams();
  const searchParams = Object.fromEntries(readOnlySearchParams.entries());
  const queryKey = JOBS_QUERY_KEYS.list(createParamsQueryKey(searchParams));
  return useInfiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>({
    queryKey,
    queryFn: ({ pageParam = startPage }) =>
      fetchJobListPage({ page: pageParam, searchParams }),
    getNextPageParam: ({ page, hasNextPage }) => (hasNextPage ? page + 1 : undefined),
    initialPageParam: startPage,
  });
};
