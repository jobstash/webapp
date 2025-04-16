'use client';

import { ChevronDownIcon, SearchIcon } from 'lucide-react';

import { cn } from '@/lib/shared/utils';

import { Button } from '@/lib/shared/ui/base/button';

import { useSearchInput } from './use-search-input';

export const SearchInput = () => {
  const {
    inputValue,
    handleInputChange,
    placeholder,
    size,
    inputRef,
    handleContainerClick,
  } = useSearchInput();

  return (
    <div
      className={cn(
        'group min-h-10 w-full rounded-lg border border-input/50 bg-sidebar/40 px-3 py-2 text-sm',
        'ring-offset-background focus-within:ring-1 focus-within:ring-ring/50 focus-within:ring-offset-1 focus-within:outline-none',
        'flex flex-wrap items-center justify-between',
        'cursor-text',
      )}
      onClick={handleContainerClick}
    >
      <div className='flex items-center gap-2'>
        <SearchIcon className='h-5 w-5 shrink-0 text-zinc-500' />
        <input
          ref={inputRef}
          className='peer h-full w-auto max-w-[28ch] min-w-[120px] flex-grow-0 border-none bg-transparent p-0 shadow-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          size={size}
        />
        {/* <div className='ml-2'>
          <Button
            variant='secondary'
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            React Jobs in Crypto
            <XIcon />
          </Button>
        </div> */}
      </div>

      <div className='flex items-center gap-2'>
        <Button
          size='sm'
          variant='ghost'
          className='bg-white/3.5'
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* <FunnelIcon className='size-3.5' /> */}
          Order
          <ChevronDownIcon className='mt-0.25 h-4 w-4' />
        </Button>
        <Button
          size='sm'
          variant='ghost'
          className='bg-white/3.5'
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* <FunnelPlusIcon className='size-3.5' /> */}
          Order by
          <ChevronDownIcon className='mt-0.25 h-4 w-4' />
        </Button>
      </div>
    </div>
  );
};
