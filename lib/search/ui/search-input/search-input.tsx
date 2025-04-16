'use client';

import { SearchIcon } from 'lucide-react';

import { cn } from '@/lib/shared/utils';

import { CVUploadCTA } from './cv-upload-cta';
import { SearchSuggestions } from './search-suggestions';
import { useSearchInput } from './use-search-input';

interface Props {
  actions?: React.ReactNode;
}

export const SearchInput = ({ actions }: Props) => {
  const {
    inputValue,
    handleInputChange,
    placeholder,
    size,
    inputRef,
    containerRef,
    handleContainerClick,
    isFocused,
    suggestionsRef,
    handleFocus,
    handleBlur,
  } = useSearchInput();

  return (
    <div className='w-full'>
      <div
        ref={containerRef}
        className={cn(
          'group min-h-10 w-full rounded-lg border border-input/50 bg-sidebar/40 px-3 py-2 text-sm',
          'flex flex-wrap items-center justify-between gap-x-4 gap-y-1',
          'cursor-text',
          isFocused &&
            'ring-1 ring-ring/50 ring-offset-1 ring-offset-background outline-none',
        )}
        onClick={handleContainerClick}
      >
        <div className='flex min-w-0 flex-grow items-center gap-2'>
          <SearchIcon className='h-5 w-5 shrink-0 text-zinc-500' />
          <input
            ref={inputRef}
            className='peer h-full w-full flex-grow border-none bg-transparent p-0 shadow-none outline-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            size={size}
          />
        </div>
        {actions}
      </div>
      <div
        ref={suggestionsRef}
        className={cn(
          'space-y-1 overflow-hidden transition-all duration-300 ease-in-out',
          isFocused ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <SearchSuggestions />
        <CVUploadCTA />
      </div>
    </div>
  );
};
