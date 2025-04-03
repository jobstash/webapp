import { ClassValue } from 'clsx';

import { cn } from '@/lib/shared/utils';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/lib/shared/ui/base/command';
import { useVirtualizedCommand } from '@/lib/shared/ui/virtualized-command/use-virtualized-command';

type Option = {
  value: string;
  label: string;
};

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
  } = useVirtualizedCommand({ options, onSelect });

  return (
    <Command
      shouldFilter={false}
      onKeyDown={handleKeyDown}
      className={cn(classNames?.command)}
    >
      <CommandInput onValueChange={handleSearch} placeholder={placeholder} />
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
                // disabled={isKeyboardNavActive}
                className={cn(
                  'absolute top-0 left-0 w-full bg-transparent',
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
                onSelect={onSelect}
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
