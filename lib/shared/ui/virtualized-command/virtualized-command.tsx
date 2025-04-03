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
  height: string;
  options: Option[];
  placeholder: string;
  onSelectOption?: (option: string) => void;
}

export const VirtualizedCommand = ({
  height,
  options,
  placeholder,
  onSelectOption,
}: VirtualizedCommandProps) => {
  const {
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
  } = useVirtualizedCommand({ options, onSelectOption });

  return (
    <Command shouldFilter={false} onKeyDown={handleKeyDown}>
      <CommandInput onValueChange={handleSearch} placeholder={placeholder} />
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
                onSelect={onSelectOption}
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
