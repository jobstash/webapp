'use client';

import type { SuggestionGroup } from '@/features/search/schemas';

import { SearchResultsList } from './search-results-list';

interface Props {
  query: string;
  groups: SuggestionGroup[];
  isLoading: boolean;
  onClose: () => void;
}

export const SearchSuggestions = ({
  query,
  groups,
  isLoading,
  onClose,
}: Props) => (
  <div className='absolute top-full left-0 z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-md border border-border bg-popover shadow-lg'>
    <SearchResultsList
      query={query}
      groups={groups}
      isLoading={isLoading}
      onClose={onClose}
    />
  </div>
);
