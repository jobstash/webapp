import { type VirtualItem } from '@tanstack/react-virtual';

import { CommandItem } from '@/components/ui/command';

interface Props {
  virtualItems: VirtualItem[];
  measureElement?: (element: HTMLDivElement | null) => void;
  filteredValues: string[];
  formatLabel: (value: string) => string;
  onSelect: (value: string) => void;
}

export const VirtualizedItems = ({
  virtualItems,
  measureElement,
  filteredValues,
  formatLabel,
  onSelect,
}: Props) => {
  return (
    <>
      {virtualItems.map((virtualItem) => {
        const value = filteredValues[virtualItem.index];

        return (
          <CommandItem
            key={value}
            data-index={virtualItem.index}
            ref={measureElement}
            value={value}
            className='absolute top-0 left-0 min-h-11 w-full bg-transparent wrap-anywhere whitespace-normal data-[selected=true]:bg-white/5'
            style={{
              transform: `translateY(${virtualItem.start}px)`,
            }}
            onSelect={onSelect}
          >
            {formatLabel(value)}
          </CommandItem>
        );
      })}
    </>
  );
};
