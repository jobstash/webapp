import { useState } from 'react';

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import { useDebounce, useMinDuration } from '@/hooks';
import { getTagColorIndex } from '@/lib/utils';
import type { PopularTagItem, UserSkill } from '@/features/profile/schemas';

const DEBOUNCE_MS = 300;
const MIN_LOADING_MS = 300;
const LIMIT = 20;

interface TagSuggestionsResponse {
  items: PopularTagItem[];
  page: number;
  hasMore: boolean;
}

const tagToSkill = (tag: PopularTagItem): UserSkill => ({
  id: tag.id,
  name: tag.name,
  colorIndex: getTagColorIndex(tag.id),
  isFromResume: false,
});

export const useSkillsSearch = (
  selectedSkillIds: Set<string>,
  isOpen: boolean,
) => {
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, DEBOUNCE_MS);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    isPlaceholderData,
  } = useInfiniteQuery({
    queryKey: ['skills-search', debouncedSearch],
    queryFn: async ({ pageParam }) => {
      const url = new URL(
        '/api/search/tags/suggestions',
        window.location.origin,
      );
      url.searchParams.set('q', debouncedSearch);
      url.searchParams.set('page', String(pageParam));
      url.searchParams.set('limit', String(LIMIT));

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Skills search failed: ${res.status}`);

      return (await res.json()) as TagSuggestionsResponse;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.hasMore ? lastPageParam + 1 : undefined,
    placeholderData: keepPreviousData,
    enabled: isOpen,
  });

  const allSkills =
    data?.pages.flatMap((page) => page.items.map(tagToSkill)) ?? [];
  const availableSkills = allSkills.filter(
    (skill) => !selectedSkillIds.has(skill.id),
  );

  const isLoadingRaw = isPending || (isPlaceholderData && isFetching);
  const isLoading = useMinDuration(isLoadingRaw, MIN_LOADING_MS);

  return {
    searchValue,
    setSearchValue,
    isInitialLoading: isPending && isOpen,
    isLoading,
    isFetchingMore: isFetchingNextPage,
    availableSkills,
    hasMore: hasNextPage,
    loadMore: fetchNextPage,
    hasQuery: debouncedSearch.length > 0,
  };
};
