import { type VirtualItem } from '@tanstack/react-virtual';

import { CommandItem } from '@/components/ui/command';

interface Props {
  virtualItems: VirtualItem[];
  filteredValues: string[];
  formatLabel: (value: string) => string;
  onSelect: (value: string) => void;
}

export const VirtualizedItems = ({
  virtualItems,
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
            value={value}
            className='absolute top-0 left-0 w-full bg-transparent data-[selected=true]:bg-white/5'
            style={{
              height: `${virtualItem.size}px`,
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
