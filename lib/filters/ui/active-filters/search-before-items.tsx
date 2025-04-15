'use client';

import { SearchCheckIcon } from 'lucide-react';

import { SelectOptionsSchema } from '@/lib/filters/core/schemas';

import { cn } from '@/lib/shared/utils';

import { CommandGroup, CommandItem } from '@/lib/shared/ui/base/command';

interface Props {
  items: SelectOptionsSchema[];
  onToggleItem: (value: string, nextState: boolean) => void;
}

export const SearchBeforeItems = ({ items, onToggleItem }: Props) => (
  <CommandGroup heading='Selected'>
    {items.map(({ label, value }, index) => (
      <CommandItem
        key={label}
        onSelect={() => onToggleItem(value, false)}
        className={cn({ 'aria-selected:bg-transparent': index === 0 })}
      >
        <SearchCheckIcon className='size-3.5 text-primary' />
        {label}
      </CommandItem>
    ))}
  </CommandGroup>
);
