import { ClassValue } from 'clsx';

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

import { useVirtualizedCommand } from './use-virtualized-command';

interface VirtualizedCommandProps {
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
}: VirtualizedCommandProps) => {
  const {
    searchValue,
    filteredOptions,
    focusedIndex,
    setFocusedIndex,
    isKeyboardNavActive,
    disableKeyboardNav,
    parentRef,
    virtualizer,
    virtualOptions,
    handleSearch,
    handleKeyDown,
    handleSelect,
  } = useVirtualizedCommand({ options, onSelect });

  return (
    <Command
      shouldFilter={false}
      onKeyDown={handleKeyDown}
      className={cn(classNames?.command)}
    >
      <CommandInput
        autoFocus
        value={searchValue}
        onValueChange={handleSearch}
        placeholder={placeholder}
      />
      {!searchValue && beforeItems}
      <CommandList
        ref={parentRef}
        style={{
          height: height,
          width: '100%',
          overflow: 'auto',
        }}
        onMouseDown={disableKeyboardNav}
        onMouseMove={disableKeyboardNav}
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
            {virtualOptions.map((virtualOption) => (
              <CommandItem
                key={filteredOptions[virtualOption.index].value}
                className={cn(
                  'absolute top-0 left-0 w-full bg-transparent data-[selected=true]:bg-white/5',
                  focusedIndex === virtualOption.index &&
                    'bg-accent text-accent-foreground',
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
