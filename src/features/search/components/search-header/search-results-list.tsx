'use client';

import { Skeleton } from '@/components/ui/skeleton';

import type { SuggestionGroup } from '@/features/search/schemas';

import { SearchResultsTabs } from './search-results-tabs';

interface Props {
  query: string;
  groups: SuggestionGroup[];
  isLoading?: boolean;
  onClose: () => void;
  showEmptyPrompt?: boolean;
}

const SKELETON_TABS = ['Jobs', 'Organizations', 'Tags'];

const SearchResultsSkeleton = () => (
  <div className='flex flex-col'>
    <div className='flex gap-1 border-b border-border px-2 py-2'>
      {SKELETON_TABS.map((tab) => (
        <Skeleton key={tab} className='h-8 w-20 rounded-md' />
      ))}
    </div>
    <div className='flex flex-col gap-0.5 px-1 py-1'>
      <Skeleton className='h-9 w-full rounded-md' />
      <Skeleton className='h-9 w-full rounded-md' />
      <Skeleton className='h-9 w-3/4 rounded-md' />
      <Skeleton className='h-9 w-5/6 rounded-md' />
    </div>
  </div>
);

const EmptyMessage = ({ children }: { children: React.ReactNode }) => (
  <p className='py-6 text-center text-sm text-muted-foreground'>{children}</p>
);

export const SearchResultsList = ({
  query,
  groups,
  isLoading = false,
  onClose,
  showEmptyPrompt = false,
}: Props) => {
  const trimmedQuery = query.trim();
  const hasResults = groups.length > 0;

  if (isLoading && !hasResults && !trimmedQuery) {
    return <SearchResultsSkeleton />;
  }

  if (hasResults) {
    return (
      <div
        className={
          isLoading
            ? 'pointer-events-none opacity-50'
            : 'flex min-h-0 flex-1 flex-col'
        }
      >
        <SearchResultsTabs groups={groups} onItemSelect={onClose} />
      </div>
    );
  }

  if (trimmedQuery && !isLoading) {
    return (
      <EmptyMessage>
        No suggestions found for &quot;{trimmedQuery}&quot;
      </EmptyMessage>
    );
  }

  if (showEmptyPrompt && !trimmedQuery && !isLoading) {
    return <EmptyMessage>Start typing to search...</EmptyMessage>;
  }

  return null;
};
