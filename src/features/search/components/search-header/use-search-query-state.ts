'use client';

import { useQueryState } from 'nuqs';
import { useProgress } from '@bprogress/next';

type SetSearchQuery = (value: string | null) => Promise<URLSearchParams>;

interface SearchQueryStateResult {
  queryParam: string | null;
  setSearchQuery: SetSearchQuery;
}

export const useSearchQueryState = (): SearchQueryStateResult => {
  const { start } = useProgress();
  const [queryParam, setQueryParam] = useQueryState('query');
  const [, setPage] = useQueryState('page');

  const setSearchQuery: SetSearchQuery = (value) => {
    start();
    setPage(null);
    return setQueryParam(value);
  };

  return { queryParam, setSearchQuery };
};
