'use client';

import { useEffect, useRef, useState } from 'react';

import { SearchButton } from './search-button';
import { SearchOverlay } from './search-overlay';
import { SearchSuggestions } from './search-suggestions';
import { useSearchQueryState } from './use-search-query-state';
import { useSearchSuggestions } from './use-search-suggestions';

export const SearchHeaderClient = () => {
  const { queryParam, setSearchQuery } = useSearchQueryState();
  const [inputValue, setInputValue] = useState(queryParam ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOverlayOpen, setIsMobileOverlayOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { groups, isLoading } = useSearchSuggestions(inputValue);

  useEffect(() => {
    setInputValue(queryParam ?? '');
  }, [queryParam]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    setSearchQuery(trimmed || null);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setInputValue(query);
  };

  return (
    <>
      <div
        ref={containerRef}
        className='relative hidden min-w-0 grow items-center gap-2 lg:flex'
      >
        <form
          onSubmit={handleSubmit}
          className='flex w-full items-center gap-2'
        >
          <SearchButton isLoading={isLoading} />
          <input
            ref={inputRef}
            type='text'
            name='search'
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            className='h-full w-full grow border-none bg-transparent p-0 shadow-none outline-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
            placeholder='Search...'
            autoComplete='off'
          />
        </form>

        {isOpen && (inputValue.trim() || groups.length > 0) && (
          <SearchSuggestions
            query={inputValue}
            groups={groups}
            onSearchSubmit={handleSearchSubmit}
            onClose={() => setIsOpen(false)}
          />
        )}
      </div>

      <div className='flex min-w-0 grow items-center gap-2 lg:hidden'>
        <SearchButton
          type='button'
          isLoading={isLoading}
          onClick={() => setIsMobileOverlayOpen(true)}
          aria-label='Open search'
        />
        <input
          type='text'
          readOnly
          value={inputValue}
          onFocus={() => setIsMobileOverlayOpen(true)}
          className='h-full w-full grow border-none bg-transparent p-0 shadow-none outline-none'
          placeholder='Search...'
        />
      </div>

      <SearchOverlay
        open={isMobileOverlayOpen}
        query={inputValue}
        groups={groups}
        isLoading={isLoading}
        onQueryChange={setInputValue}
        onSearchSubmit={handleSearchSubmit}
        onClose={() => setIsMobileOverlayOpen(false)}
      />
    </>
  );
};
