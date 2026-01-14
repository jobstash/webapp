'use client';

import { SearchIcon } from 'lucide-react';

import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

import type { SuggestionGroup } from '@/features/search/schemas';

import { SearchSuggestionItem } from './search-suggestion-item';

interface Props {
  query: string;
  groups: SuggestionGroup[];
  onSearchSubmit: (query: string) => void;
  onClose: () => void;
  showEmptyPrompt?: boolean;
}

export const SearchResultsList = ({
  query,
  groups,
  onSearchSubmit,
  onClose,
  showEmptyPrompt = false,
}: Props) => {
  const trimmedQuery = query.trim();
  const hasResults = groups.length > 0;

  return (
    <>
      {trimmedQuery && (
        <CommandGroup>
          <CommandItem
            onSelect={() => {
              onSearchSubmit(trimmedQuery);
              onClose();
            }}
          >
            <SearchIcon className='mr-2 size-4' />
            Search for &quot;{trimmedQuery}&quot;
          </CommandItem>
        </CommandGroup>
      )}

      {hasResults &&
        groups.map((group) => (
          <CommandGroup key={group.label} heading={group.label}>
            {group.items.map((item) => (
              <SearchSuggestionItem
                key={item.id}
                item={item}
                onSelect={onClose}
              />
            ))}
          </CommandGroup>
        ))}

      {!hasResults && trimmedQuery && (
        <CommandEmpty>
          No suggestions found for &quot;{trimmedQuery}&quot;
        </CommandEmpty>
      )}

      {showEmptyPrompt && !hasResults && !trimmedQuery && (
        <div className='py-6 text-center text-sm text-muted-foreground'>
          Start typing to search...
        </div>
      )}
    </>
  );
};
