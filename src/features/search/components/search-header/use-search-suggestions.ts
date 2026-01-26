'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { useDebounce, useMinDuration } from '@/hooks';

import {
  suggestionsResponseSchema,
  type SuggestionGroup,
} from '@/features/search/schemas';

const DEBOUNCE_MS = 300;
const MIN_LOADING_MS = 200;

interface SearchSuggestionsResult {
  groups: SuggestionGroup[];
  isLoading: boolean;
}

export const useSearchSuggestions = (
  query: string,
): SearchSuggestionsResult => {
  const debouncedQuery = useDebounce(query, DEBOUNCE_MS);
  const trimmed = debouncedQuery.trim();

  const { data, isFetching } = useQuery({
    queryKey: ['search-suggestions', trimmed],
    queryFn: async () => {
      const res = await fetch(
        `/api/search/suggestions?q=${encodeURIComponent(trimmed)}`,
      );
      if (!res.ok) {
        throw new Error(`Search suggestions failed: ${res.status}`);
      }
      const json: unknown = await res.json();
      return suggestionsResponseSchema.parse(json);
    },
    placeholderData: keepPreviousData,
  });

  const isLoading = useMinDuration(isFetching, MIN_LOADING_MS);

  return { groups: data ?? [], isLoading };
};
