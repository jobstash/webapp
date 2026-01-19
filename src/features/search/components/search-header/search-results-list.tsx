'use client';

import { LoaderIcon, SearchIcon } from 'lucide-react';

import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Skeleton } from '@/components/ui/skeleton';

import type { SuggestionGroup } from '@/features/search/schemas';

import { SearchSuggestionItem } from './search-suggestion-item';

interface Props {
  query: string;
  groups: SuggestionGroup[];
  isLoading?: boolean;
  onSearchSubmit: (query: string) => void;
  onClose: () => void;
  showEmptyPrompt?: boolean;
}

const SKELETON_GROUPS = [
  { label: 'Jobs', widths: ['w-48', 'w-56', 'w-40'] },
  { label: 'Organizations', widths: ['w-32', 'w-44', 'w-36'] },
  { label: 'Tags', widths: ['w-20', 'w-28', 'w-24'] },
];

export const SearchResultsList = ({
  query,
  groups,
  isLoading = false,
  onSearchSubmit,
  onClose,
  showEmptyPrompt = false,
}: Props) => {
  const trimmedQuery = query.trim();
  const hasResults = groups.length > 0;

  // Initial load with no results - show skeleton
  if (isLoading && !hasResults && !trimmedQuery) {
    return (
      <>
        {SKELETON_GROUPS.map((group) => (
          <CommandGroup key={group.label} heading={group.label}>
            {group.widths.map((width, i) => (
              <div key={i} className='px-2 py-1.5'>
                <Skeleton className={`h-5 ${width}`} />
              </div>
            ))}
          </CommandGroup>
        ))}
      </>
    );
  }

  // Pending state classes - reduce opacity when fetching new results
  const pendingClass = isLoading ? 'opacity-50 pointer-events-none' : '';

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
            {isLoading ? (
              <LoaderIcon className='mr-2 size-4 animate-spin' />
            ) : (
              <SearchIcon className='mr-2 size-4' />
            )}
            Search for &quot;{trimmedQuery}&quot;
          </CommandItem>
        </CommandGroup>
      )}

      {hasResults && (
        <div className={pendingClass}>
          {groups.map((group) => (
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
        </div>
      )}

      {!hasResults && trimmedQuery && !isLoading && (
        <CommandEmpty>
          No suggestions found for &quot;{trimmedQuery}&quot;
        </CommandEmpty>
      )}

      {showEmptyPrompt && !hasResults && !trimmedQuery && !isLoading && (
        <div className='py-6 text-center text-sm text-muted-foreground'>
          Start typing to search...
        </div>
      )}
    </>
  );
};
