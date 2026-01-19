'use client';

import { Command, CommandList } from '@/components/ui/command';

import type { SuggestionGroup } from '@/features/search/schemas';

import { SearchResultsList } from './search-results-list';

interface Props {
  query: string;
  groups: SuggestionGroup[];
  isLoading: boolean;
  onSearchSubmit: (query: string) => void;
  onClose: () => void;
}

export const SearchSuggestions = ({
  query,
  groups,
  isLoading,
  onSearchSubmit,
  onClose,
}: Props) => (
  <div className='absolute top-full left-0 z-50 mt-2 w-full rounded-md border border-neutral-800 bg-background shadow-lg'>
    <Command className='rounded-md' shouldFilter={false}>
      <CommandList className='max-h-80'>
        <SearchResultsList
          query={query}
          groups={groups}
          isLoading={isLoading}
          onSearchSubmit={onSearchSubmit}
          onClose={onClose}
        />
      </CommandList>
    </Command>
  </div>
);
