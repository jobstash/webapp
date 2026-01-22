'use client';

import { useRef } from 'react';

import { type ClassValue } from 'clsx';
import { useVirtualizer } from '@tanstack/react-virtual';
import { LoaderIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from '@/components/ui/command';

import { useRemoteVirtualizedCommand } from './use-remote-virtualized-command';
import { SelectedItems } from './selected-items';
import { VirtualizedItems } from './virtualized-items';

interface Props<T> {
  queryKeyPrefix: string;
  endpoint: (query: string) => string;
  responseToValues: (data: T) => string[];
  initialValues: string[];
  selectedValues: string[];
  excludeValues?: string[];
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
  queryKeyPrefix,
  endpoint,
  responseToValues,
  initialValues,
  selectedValues,
  excludeValues,
  formatLabel,
  height = '400px',
  placeholder = 'Search...',
  onSelect,
  onDeselect,
  classNames,
  fetchOptions,
}: Props<T>) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const {
    searchValue,
    setSearchValue,
    isLoading,
    filteredValues,
    isEmpty,
    handleSelect,
  } = useRemoteVirtualizedCommand({
    queryKeyPrefix,
    endpoint,
    responseToValues,
    initialValues,
    selectedValues,
    excludeValues,
    fetchOptions,
    onSelect,
  });

  const virtualizer = useVirtualizer({
    count: filteredValues.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  return (
    <Command shouldFilter={false} className={cn(classNames?.command)}>
      <CommandInput
        icon={
          isLoading ? (
            <LoaderIcon className='size-4 shrink-0 animate-spin' />
          ) : undefined
        }
        value={searchValue}
        onValueChange={setSearchValue}
        placeholder={placeholder}
      />

      {!searchValue && (
        <SelectedItems
          values={selectedValues}
          formatLabel={formatLabel}
          onDeselect={onDeselect}
        />
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
            <VirtualizedItems
              virtualItems={virtualizer.getVirtualItems()}
              filteredValues={filteredValues}
              formatLabel={formatLabel}
              onSelect={handleSelect}
            />
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
