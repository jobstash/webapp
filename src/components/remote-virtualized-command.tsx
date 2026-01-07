import { useRef, useState } from 'react';

import { type ClassValue } from 'clsx';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Loader2Icon, SearchCheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useDebounce, useRemoteFetch } from '@/hooks';

const DEBOUNCE_MS = 500;

interface Props<T> {
  endpoint: (query: string) => string;
  responseToValues: (data: T) => string[];
  initialValues: string[];
  selectedValues: string[];
  formatLabel: (value: string) => string;
  height?: string;
  placeholder?: string;
  onSelect?: (value: string) => void;
  onDeselect?: (value: string) => void;
  classNames?: {
    command?: ClassValue;
  };
  fetchOptions?: RequestInit;
}

export const RemoteVirtualizedCommand = <T,>({
  endpoint,
  responseToValues,
  initialValues,
  selectedValues,
  formatLabel,
  height = '400px',
  placeholder = 'Search...',
  onSelect,
  onDeselect,
  classNames,
  fetchOptions,
}: Props<T>) => {
  const [searchValue, setSearchValue] = useState('');
  const parentRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchValue, DEBOUNCE_MS);

  const { data, isLoading } = useRemoteFetch(
    debouncedSearch ? endpoint(debouncedSearch) : null,
    { transform: responseToValues, fetchOptions },
  );

  const getFilteredValues = () => {
    if (isLoading) return [];
    const values = data ?? initialValues;
    return values.filter((v) => !selectedValues.includes(v));
  };

  const filteredValues = getFilteredValues();

  const virtualizer = useVirtualizer({
    count: filteredValues.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  const virtualItems = virtualizer.getVirtualItems();

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleSelect = (value: string) => {
    onSelect?.(value);
    setSearchValue('');
  };

  const isEmpty = filteredValues.length === 0;

  return (
    <Command shouldFilter={false} className={cn(classNames?.command)}>
      <CommandInput
        icon={
          isLoading ? (
            <Loader2Icon className='size-4 shrink-0 animate-spin' />
          ) : undefined
        }
        value={searchValue}
        onValueChange={handleSearch}
        placeholder={placeholder}
      />
      {!searchValue && selectedValues.length > 0 && (
        <CommandGroup heading='Selected'>
          {selectedValues.map((value) => (
            <CommandItem
              key={value}
              onSelect={() => onDeselect?.(value)}
              className='data-[selected=true]:bg-white/5'
            >
              <SearchCheckIcon className='size-3.5 text-primary' />
              {formatLabel(value)}
            </CommandItem>
          ))}
        </CommandGroup>
      )}
      {!isLoading && <CommandEmpty>No item found.</CommandEmpty>}
      <CommandList
        ref={parentRef}
        style={{
          height: isEmpty ? 'auto' : height,
          width: '100%',
          overflow: 'auto',
        }}
      >
        <CommandGroup>
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualItems.map((virtualItem) => {
              const value = filteredValues[virtualItem.index];

              return (
                <CommandItem
                  key={value}
                  value={value}
                  className='absolute top-0 left-0 w-full bg-transparent data-[selected=true]:bg-white/5'
                  style={{
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  onSelect={handleSelect}
                >
                  {formatLabel(value)}
                </CommandItem>
              );
            })}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
