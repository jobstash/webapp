'use client';

import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { ClassValue } from 'clsx';
import { LoaderIcon } from 'lucide-react';

import { Option } from '@/lib/shared/core/types';

import { cn } from '@/lib/shared/utils';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/lib/shared/ui/base/command';

import { useCommandNavigation } from './use-command-navigation';
import { useCommandState } from './use-command-state';
import { useCommandVirtualization } from './use-command-virtualization';

interface Props<T> {
  queryKey: string[];
  endpoint: (query: string) => string;
  transformResponse?: (data: T) => Option[];
  options: Option[];
  height?: string;
  placeholder?: string;
  onSelect?: (value: string) => void;
  beforeItems?: React.ReactNode;
  classNames?: {
    command?: ClassValue;
  };
}

export const RemoteVirtualizedCommand = <T,>({
  queryKey,
  endpoint,
  transformResponse,
  options: initialOptions,
  height = '400px',
  placeholder = 'Search...',
  onSelect,
  beforeItems,
  classNames,
}: Props<T>) => {
  const {
    searchValue,
    debouncedSearchValue,
    disableKeyboardNav,
    setSearchValue,
    focusedIndex,
    setFocusedIndex,
    enableKeyboardNav,
    isKeyboardNavActive,
  } = useCommandState();

  const { data, isLoading } = useQuery({
    queryKey: ['remote-virtualized-command', ...queryKey, debouncedSearchValue],
    queryFn: async () => {
      const res = await fetch(endpoint(debouncedSearchValue));
      const result = await res.json();
      return result;
    },
    enabled: !!debouncedSearchValue,
    select: transformResponse,
  });

  const filteredOptions = useMemo(() => {
    if (data) return data;
    if (isLoading) return [];
    return initialOptions;
  }, [data, initialOptions, isLoading]);

  const { parentRef, virtualizer, virtualOptions, scrollToIndex } =
    useCommandVirtualization({ filteredOptions });

  const handleSearch = (search: string) => {
    disableKeyboardNav();
    setSearchValue(search);
  };

  const handleSelect = (value: string) => {
    onSelect?.(value);
    setSearchValue(''); // Reset search value on select
  };

  const { handleKeyDown } = useCommandNavigation({
    filteredOptions,
    focusedIndex,
    setFocusedIndex,
    enableKeyboardNav,
    scrollToIndex,
    handleSelect,
  });

  const isEmpty = filteredOptions.length === 0;

  return (
    <Command
      shouldFilter={false}
      onKeyDown={handleKeyDown}
      className={cn(classNames?.command)}
    >
      <CommandInput
        icon={
          isLoading ? <LoaderIcon className='size-4 shrink-0 animate-spin' /> : undefined
        }
        autoFocus
        value={searchValue}
        onValueChange={handleSearch}
        placeholder={placeholder}
      />
      {!searchValue && beforeItems}
      {!isLoading && <CommandEmpty>No item found.</CommandEmpty>}
      <CommandList
        ref={parentRef}
        style={{
          height: isEmpty ? 'auto' : height,
          width: '100%',
          overflow: 'auto',
        }}
        onMouseDown={disableKeyboardNav}
        onMouseMove={disableKeyboardNav}
      >
        <CommandGroup>
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualOptions.map((virtualOption, index) => (
              <CommandItem
                key={`${filteredOptions[virtualOption.index].value}-${index}`}
                className={cn(
                  'absolute top-0 left-0 w-full bg-transparent data-[selected=true]:bg-white/10',
                  focusedIndex === virtualOption.index &&
                    'bg-white/10 text-accent-foreground',
                  isKeyboardNavActive &&
                    focusedIndex !== virtualOption.index &&
                    'aria-selected:bg-transparent aria-selected:text-primary',
                )}
                style={{
                  height: `${virtualOption.size}px`,
                  transform: `translateY(${virtualOption.start}px)`,
                }}
                value={filteredOptions[virtualOption.index].value}
                onMouseEnter={() =>
                  !isKeyboardNavActive && setFocusedIndex(virtualOption.index)
                }
                onMouseLeave={() => !isKeyboardNavActive && setFocusedIndex(-1)}
                onSelect={handleSelect}
              >
                {filteredOptions[virtualOption.index].label}
              </CommandItem>
            ))}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
