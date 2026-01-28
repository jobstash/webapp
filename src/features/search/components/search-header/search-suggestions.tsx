'use client';

import type {
  SuggestionGroupInfo,
  SuggestionItem,
} from '@/features/search/schemas';

import { SearchResultsList } from './search-results-list';

export interface SearchSuggestionsProps {
  query: string;
  availableGroups: SuggestionGroupInfo[];
  activeGroup: string;
  items: SuggestionItem[];
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  onGroupChange: (groupId: string) => void;
  loadMore: () => void;
  onClose: () => void;
}

export const SearchSuggestions = ({
  query,
  availableGroups,
  activeGroup,
  items,
  hasMore,
  isLoading,
  isLoadingMore,
  onGroupChange,
  loadMore,
  onClose,
}: SearchSuggestionsProps) => (
  <div className='absolute top-full left-0 z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-md border border-border bg-popover shadow-lg'>
    <SearchResultsList
      query={query}
      availableGroups={availableGroups}
      activeGroup={activeGroup}
      items={items}
      hasMore={hasMore}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      onGroupChange={onGroupChange}
      onLoadMore={loadMore}
      onClose={onClose}
    />
  </div>
);
