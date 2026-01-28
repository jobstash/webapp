'use client';

import { useEffect, useRef } from 'react';
import { ArrowLeftIcon, SearchIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { SearchSuggestionsProps } from './search-suggestions';
import { SearchResultsList } from './search-results-list';

interface Props extends SearchSuggestionsProps {
  open: boolean;
  onQueryChange: (query: string) => void;
  onItemSelect: () => void;
}

export const SearchOverlay = ({
  open,
  query,
  availableGroups,
  activeGroup,
  items,
  hasMore,
  isLoading,
  isLoadingMore,
  onGroupChange,
  loadMore,
  onQueryChange,
  onItemSelect,
  onClose,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className='top-0 left-0 h-full max-h-none w-full max-w-none translate-x-0 translate-y-0 rounded-none border-0 bg-popover p-0 data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top'
        showCloseButton={false}
      >
        <DialogHeader className='sr-only'>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>

        <div className='flex h-full flex-col'>
          <div className='flex items-center gap-2 border-b border-border px-4 py-3'>
            <Button
              variant='ghost'
              size='icon'
              className='shrink-0'
              onClick={onClose}
            >
              <ArrowLeftIcon className='size-5' />
              <span className='sr-only'>Back</span>
            </Button>

            <div className='flex grow items-center gap-2'>
              <SearchIcon className='size-5 shrink-0 text-muted-foreground' />
              <input
                ref={inputRef}
                type='text'
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder='Search...'
                className='h-10 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground'
              />
            </div>
          </div>

          <div className='flex-1 overflow-y-auto'>
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
              onClose={onItemSelect}
              showEmptyPrompt
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
