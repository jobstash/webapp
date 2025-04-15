'use client';

import { useState } from 'react';

import { ListFilterPlusIcon } from 'lucide-react';

import { FilterConfigSchema } from '@/lib/filters/core/schemas';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from '@/lib/shared/ui/base/command';
import { FilterDropdown } from '@/lib/filters/ui/filter-dropdown';

import { Item } from './item';
import { useMoreFilters } from './use-more-filters';

interface Props {
  configs: FilterConfigSchema[];
}

export const MoreFilters = ({ configs }: Props) => {
  const { options } = useMoreFilters(configs);
  const [open, setOpen] = useState(false);
  const closeDropdown = () => setOpen(false);

  const onOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <FilterDropdown
      open={open}
      onOpenChange={onOpenChange}
      label='More Filters'
      icon={<ListFilterPlusIcon className='size-4' />}
      withDropdownIcon={false}
      classNames={{
        content: 'border-neutral-800 p-0',
        trigger:
          'h-7 items-center gap-1.5 border border-none bg-sidebar text-muted-foreground/80 hover:bg-muted data-[state=open]:bg-muted data-[state=open]:text-foreground',
      }}
    >
      <Command>
        <CommandInput placeholder='Search filters...' />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {options.map((config) => (
              <Item key={config.label} config={config} closeDropdown={closeDropdown} />
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </FilterDropdown>
  );
};
