'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon } from 'lucide-react';

import { GA_EVENT, trackEvent } from '@/lib/analytics';

import { SearchButton } from './search-button';
import { SearchOverlay } from './search-overlay';
import { SearchSuggestions } from './search-suggestions';
import { useSearchSuggestions } from './use-search-suggestions';

export const SearchHeaderClient = ({ totalJobs }: { totalJobs?: number }) => {
  const placeholder =
    totalJobs === undefined
      ? 'Search jobs'
      : `Search ${new Intl.NumberFormat('en-US').format(totalJobs)} jobs`;
  const router = useRouter();
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

  const submitJobTitleSearch = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    trackSearchQuery();
    setIsOpen(false);
    setIsMobileOverlayOpen(false);
    inputRef.current?.blur();
    router.push(`/?titleQuery=${encodeURIComponent(trimmed)}`);
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
          onSubmit={(event) => {
            event.preventDefault();
            submitJobTitleSearch();
          }}
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
            placeholder={placeholder}
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

      <button
        type='button'
        onClick={handleOpenMobileOverlay}
        aria-label={placeholder}
        className='flex min-h-11 min-w-0 flex-1 items-center gap-2 px-3 text-left text-sm text-muted-foreground lg:hidden'
      >
        <SearchIcon className='size-4 shrink-0' aria-hidden />
        <span className='truncate'>{placeholder}</span>
      </button>

      <SearchOverlay
        open={isMobileOverlayOpen}
        query={inputValue}
        {...suggestions}
        onQueryChange={setInputValue}
        onSubmit={submitJobTitleSearch}
        onItemSelect={handleMobileItemSelect}
        onClose={closeMobileOverlay}
      />
    </>
  );
};
