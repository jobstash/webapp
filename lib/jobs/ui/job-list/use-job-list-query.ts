import { useSearchParams } from 'next/navigation';

import { useInfiniteQuery } from '@tanstack/react-query';

import { JOBS_QUERIES } from '@/lib/jobs/core/queries';

// Start from page 2 because the first page is SSR'd and hooks are client side
const DEFAULT_START_PAGE = 2;

export const useJobListQuery = (startPage = DEFAULT_START_PAGE) => {
  const readOnlySearchParams = useSearchParams();
  const searchParams = Object.fromEntries(readOnlySearchParams.entries());
  return useInfiniteQuery(JOBS_QUERIES.list(searchParams, startPage));
};
