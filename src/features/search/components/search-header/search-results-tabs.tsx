'use client';

import Link from 'next/link';
import { Loader2Icon } from 'lucide-react';

import { cn } from '@/lib/utils';

import type {
  SuggestionGroupInfo,
  SuggestionItem,
} from '@/features/search/schemas';

import { HighlightMatch } from './highlight-match';

interface Props {
  query: string;
  groups: SuggestionGroupInfo[];
  activeGroup: string;
  items: SuggestionItem[];
  hasMore: boolean;
  isLoading?: boolean;
  isLoadingMore: boolean;
  onGroupChange: (groupId: string) => void;
  onLoadMore: () => void;
  onItemSelect?: () => void;
}

const ResultItem = ({
  item,
  query,
  highlightEnabled,
  onSelect,
}: {
  item: SuggestionItem;
  query: string;
  highlightEnabled: boolean;
  onSelect?: () => void;
}) => (
  <Link
    href={item.href}
    onClick={(e) => {
      const isModifierClick = e.altKey || e.metaKey || e.ctrlKey;
      if (!isModifierClick) onSelect?.();
    }}
    className='block rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground focus-visible:outline-none'
  >
    <HighlightMatch
      text={item.label}
      query={query}
      enabled={highlightEnabled}
    />
  </Link>
);

const TabButton = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    type='button'
    onClick={onClick}
    className={cn(
      'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
      isActive
        ? 'bg-accent text-accent-foreground'
        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
    )}
  >
    {label}
  </button>
);

export const SearchResultsTabs = ({
  query,
  groups,
  activeGroup,
  items,
  hasMore,
  isLoading = false,
  isLoadingMore,
  onGroupChange,
  onLoadMore,
  onItemSelect,
}: Props) => {
  if (groups.length === 0) return null;

  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      <div className='flex gap-1 border-b border-border px-2 py-2'>
        {groups.map((group) => (
          <TabButton
            key={group.id}
            label={group.label}
            isActive={group.id === activeGroup}
            onClick={() => onGroupChange(group.id)}
          />
        ))}
      </div>

      <div className='min-h-0 flex-1 overflow-y-auto px-1 py-1'>
        {items.map((item) => (
          <ResultItem
            key={item.id}
            item={item}
            query={query}
            highlightEnabled={!isLoading}
            onSelect={onItemSelect}
          />
        ))}

        {hasMore && (
          <button
            type='button'
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className='mt-1 flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-50'
          >
            {isLoadingMore ? (
              <>
                <Loader2Icon className='size-4 animate-spin' />
                Loading...
              </>
            ) : (
              'Load more'
            )}
          </button>
        )}
      </div>
    </div>
  );
};
