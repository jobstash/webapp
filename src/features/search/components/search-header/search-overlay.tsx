'use client';

import { useEffect, useRef } from 'react';
import { ArrowLeftIcon, CornerDownLeftIcon, SearchIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import type { SuggestionGroup } from '@/features/search/schemas';

import { SearchResultsList } from './search-results-list';

interface Props {
  open: boolean;
  query: string;
  groups: SuggestionGroup[];
  isLoading: boolean;
  onQueryChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  onClose: () => void;
}

export const SearchOverlay = ({
  open,
  query,
  groups,
  isLoading,
  onQueryChange,
  onSearchSubmit,
  onClose,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const trimmedQuery = query.trim();

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmedQuery) return;
    onSearchSubmit(trimmedQuery);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className='top-0 left-0 h-full max-h-none w-full max-w-none translate-x-0 translate-y-0 rounded-none border-0 p-0 data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top'
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

            <form
              onSubmit={handleSubmit}
              className='flex grow items-center gap-2'
            >
              <SearchIcon className='size-5 shrink-0 text-muted-foreground' />
              <input
                ref={inputRef}
                type='text'
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder='Search...'
                className='h-10 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground'
              />
              {trimmedQuery && (
                <button
                  type='submit'
                  className='shrink-0 rounded-md bg-accent p-1.5 text-muted-foreground transition-colors hover:bg-accent/80 hover:text-foreground'
                  aria-label='Search'
                >
                  <CornerDownLeftIcon className='size-4' />
                </button>
              )}
            </form>
          </div>

          <div className='flex-1 overflow-y-auto'>
            <SearchResultsList
              query={query}
              groups={groups}
              isLoading={isLoading}
              onClose={onClose}
              showEmptyPrompt
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
