import { useRef, useState } from 'react';

import { type ClassValue } from 'clsx';
import { useVirtualizer } from '@tanstack/react-virtual';

import { type Option } from '@/lib/types';
import { cn, fuzzySearch } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

interface Props {
  options: Option[];
  height?: string;
  placeholder?: string;
  onSelect?: (value: string) => void;
  beforeItems?: React.ReactNode;
  classNames?: {
    command?: ClassValue;
  };
}

export const VirtualizedCommand = ({
  options,
  height = '400px',
  placeholder = 'Search...',
  onSelect,
  beforeItems,
  classNames,
}: Props) => {
  const [searchValue, setSearchValue] = useState('');
  const parentRef = useRef<HTMLDivElement>(null);

  const searchSpace = options.map((o) => o.label.replaceAll(' ', ''));

  const filteredOptions = searchValue
    ? fuzzySearch(searchSpace, searchValue, options)
    : options;

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
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

  return (
    <Command shouldFilter={false} className={cn(classNames?.command)}>
      <CommandInput
        value={searchValue}
        onValueChange={handleSearch}
        placeholder={placeholder}
      />
      {!searchValue && beforeItems}
      <CommandList
        ref={parentRef}
        style={{ height, width: '100%', overflow: 'auto' }}
      >
        <CommandEmpty>No item found.</CommandEmpty>
        <CommandGroup>
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualItems.map((virtualItem) => {
              const option = filteredOptions[virtualItem.index];

              return (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  className='absolute top-0 left-0 w-full bg-transparent data-[selected=true]:bg-white/5'
                  style={{
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  onSelect={handleSelect}
                >
                  {option.label}
                </CommandItem>
              );
            })}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
