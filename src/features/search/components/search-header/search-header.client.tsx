'use client';

import { useEffect, useRef, useState } from 'react';

import { GA_EVENT, trackEvent } from '@/lib/analytics';

import { SearchButton } from './search-button';
import { SearchOverlay } from './search-overlay';
import { SearchSuggestions } from './search-suggestions';
import { useSearchSuggestions } from './use-search-suggestions';

export const SearchHeaderClient = () => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOverlayOpen, setIsMobileOverlayOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useSearchSuggestions(inputValue);

  const closeDropdown = () => {
    setInputValue('');
    setIsOpen(false);
  };

  const closeMobileOverlay = () => {
    setInputValue('');
    setIsMobileOverlayOpen(false);
  };

  const trackSearchQuery = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      trackEvent(GA_EVENT.SEARCH_QUERY, { search_query: trimmed });
    }
  };

  const handleItemSelect = () => {
    trackSearchQuery();
    closeDropdown();
  };

  const handleMobileItemSelect = () => {
    trackSearchQuery();
    closeMobileOverlay();
  };

  const handleOpenDropdown = () => setIsOpen(true);
  const handleOpenMobileOverlay = () => setIsMobileOverlayOpen(true);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutside =
        containerRef.current &&
        !containerRef.current.contains(event.target as Node);
      if (isOutside) closeDropdown();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown();
        inputRef.current?.blur();
      }
    };

    // Only attach listeners when desktop dropdown is open (not mobile overlay)
    if (!isOpen) return;

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      <div
        ref={containerRef}
        className='relative hidden min-w-0 grow items-center gap-2 lg:flex'
      >
        <form
          onSubmit={(e) => e.preventDefault()}
          className='flex w-full items-center gap-2'
        >
          <SearchButton />
          <input
            ref={inputRef}
            type='text'
            name='search'
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              handleOpenDropdown();
            }}
            onFocus={handleOpenDropdown}
            className='h-full w-full grow border-none bg-transparent p-0 shadow-none outline-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
            placeholder='Search...'
            autoComplete='off'
          />
        </form>

        {isOpen && (
          <SearchSuggestions
            query={inputValue}
            {...suggestions}
            onClose={handleItemSelect}
          />
        )}
      </div>

      <div className='flex min-w-0 grow items-center gap-2 lg:hidden'>
        <SearchButton
          type='button'
          onClick={handleOpenMobileOverlay}
          aria-label='Open search'
        />
        <input
          type='text'
          readOnly
          value={inputValue}
          onFocus={handleOpenMobileOverlay}
          className='h-full w-full grow border-none bg-transparent p-0 shadow-none outline-none'
          placeholder='Search...'
        />
      </div>

      <SearchOverlay
        open={isMobileOverlayOpen}
        query={inputValue}
        {...suggestions}
        onQueryChange={setInputValue}
        onItemSelect={handleMobileItemSelect}
        onClose={closeMobileOverlay}
      />
    </>
  );
};
