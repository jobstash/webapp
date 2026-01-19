'use client';

import { useEffect, useRef } from 'react';
import { ArrowLeftIcon, SearchIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Command, CommandList } from '@/components/ui/command';
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
          <div className='flex items-center gap-2 border-b border-neutral-800 px-4 py-3'>
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
              <button
                type='submit'
                className='shrink-0 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400'
                aria-label='Search'
              >
                <SearchIcon className='size-5' />
              </button>
              <input
                ref={inputRef}
                type='text'
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder='Search...'
                className='h-10 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground'
              />
            </form>
          </div>

          <Command className='flex-1 rounded-none' shouldFilter={false}>
            <CommandList className='h-full max-h-none'>
              <SearchResultsList
                query={query}
                groups={groups}
                isLoading={isLoading}
                onSearchSubmit={onSearchSubmit}
                onClose={onClose}
                showEmptyPrompt
              />
            </CommandList>
          </Command>
        </div>
      </DialogContent>
    </Dialog>
  );
};
