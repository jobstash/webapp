'use client';

import { useState } from 'react';

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import { useDebounce, useMinDuration } from '@/hooks';

import { suggestionsResponseSchema } from '@/features/search/schemas';

const DEBOUNCE_MS = 300;
const MIN_LOADING_MS = 200;

export const useSearchSuggestions = (query: string) => {
  const debouncedQuery = useDebounce(query, DEBOUNCE_MS);
  const trimmed = debouncedQuery.trim();

  const [groupSelection, setGroupSelection] = useState({
    query: '',
    group: '',
  });
  const selectedGroup =
    groupSelection.query === trimmed ? groupSelection.group : '';

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPlaceholderData,
    isPending,
  } = useInfiniteQuery({
    queryKey: ['search-suggestions', trimmed, selectedGroup],
    queryFn: async ({ pageParam }) => {
      const url = new URL('/api/search/suggestions', window.location.origin);
      url.searchParams.set('q', trimmed);
      if (selectedGroup) url.searchParams.set('group', selectedGroup);
      url.searchParams.set('page', String(pageParam));

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`Search suggestions failed: ${res.status}`);

      const json: unknown = await res.json();
      return suggestionsResponseSchema.parse(json);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.hasMore ? lastPageParam + 1 : undefined,
    placeholderData: keepPreviousData,
  });

  const pages = data?.pages ?? [];
  const latestPage = pages.at(-1);

  const isLoadingRaw = isPending || (isPlaceholderData && isFetching);
  const isLoading = useMinDuration(isLoadingRaw, MIN_LOADING_MS);

  return {
    availableGroups: latestPage?.groups ?? [],
    activeGroup: selectedGroup || latestPage?.activeGroup || '',
    onGroupChange: (group: string) =>
      setGroupSelection({ query: trimmed, group }),
    items: pages.flatMap((page) => page.items),
    hasMore: hasNextPage ?? false,
    loadMore: fetchNextPage,
    isLoading,
    isLoadingMore: isFetchingNextPage,
  };
};
