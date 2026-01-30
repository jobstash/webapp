import { useState } from 'react';

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import { useDebounce, useMinDuration } from '@/hooks';
import { clientEnv } from '@/lib/env/client';
import { getColorIndex } from '@/features/onboarding/constants';
import {
  popularTagsResponseSchema,
  type PopularTagItem,
  type UserSkill,
} from '@/features/onboarding/schemas';

const DEBOUNCE_MS = 300;
const MIN_LOADING_MS = 300;
const LIMIT = 20;

const tagToSkill = (tag: PopularTagItem): UserSkill => ({
  id: tag.normalizedName,
  name: tag.name,
  colorIndex: getColorIndex(tag.normalizedName),
  isFromResume: false,
});

interface SkillsSearchResult {
  searchValue: string;
  setSearchValue: (value: string) => void;
  isInitialLoading: boolean;
  isLoading: boolean;
  isFetchingMore: boolean;
  availableSkills: UserSkill[];
  hasMore: boolean;
  loadMore: () => void;
  hasQuery: boolean;
}

export const useSkillsSearch = (
  selectedSkillIds: Set<string>,
  isOpen: boolean,
): SkillsSearchResult => {
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
    queryKey: ['onboarding-skills', debouncedSearch],
    queryFn: async ({ pageParam }) => {
      const url = new URL('/search/tags/suggestions', clientEnv.MW_URL);
      url.searchParams.set('q', debouncedSearch);
      url.searchParams.set('page', String(pageParam));
      url.searchParams.set('limit', String(LIMIT));

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Skills search failed: ${res.status}`);

      const json: unknown = await res.json();
      return popularTagsResponseSchema.parse(json).data;
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
