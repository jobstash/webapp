'use client';

import { cn } from '@/lib/utils';

import type {
  SuggestionGroupInfo,
  SuggestionItem,
} from '@/features/search/schemas';

import { SearchResultsTabs } from './search-results-tabs';

interface Props {
  query: string;
  availableGroups: SuggestionGroupInfo[];
  activeGroup: string;
  items: SuggestionItem[];
  hasMore: boolean;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  onGroupChange: (groupId: string) => void;
  onLoadMore: () => void;
  onClose: () => void;
  showEmptyPrompt?: boolean;
}

export const SearchResultsList = ({
  query,
  availableGroups,
  activeGroup,
  items,
  hasMore,
  isLoading = false,
  isLoadingMore = false,
  onGroupChange,
  onLoadMore,
  onClose,
  showEmptyPrompt = false,
}: Props) => {
  const trimmedQuery = query.trim();
  const hasResults = availableGroups.length > 0;

  if (hasResults) {
    return (
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col',
          isLoading && 'pointer-events-none opacity-50',
        )}
      >
        <SearchResultsTabs
          query={trimmedQuery}
          groups={availableGroups}
          activeGroup={activeGroup}
          items={items}
          hasMore={hasMore}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          onGroupChange={onGroupChange}
          onLoadMore={onLoadMore}
          onItemSelect={onClose}
        />
      </div>
    );
  }

  if (isLoading) return null;

  if (trimmedQuery) {
    return (
      <p className='py-6 text-center text-sm text-muted-foreground'>
        No suggestions found for &quot;{trimmedQuery}&quot;
      </p>
    );
  }

  if (showEmptyPrompt) {
    return (
      <p className='py-6 text-center text-sm text-muted-foreground'>
        Start typing to search...
      </p>
    );
  }

  return null;
};
