'use client';

import { ListFilterPlusIcon } from 'lucide-react';

import { FilterConfigItemSchema } from '@/lib/filters/core/schemas';
import { useFilterStore } from '@/lib/filters/core/store';

import { Button } from '@/lib/shared/ui/base/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from '@/lib/shared/ui/base/command';
import { FilterItemPopover } from '@/lib/filters/ui/filter-item-popover';

import { MoreFiltersItem } from './more-filters-item';

interface Props {
  filters: FilterConfigItemSchema[];
}

export const MoreFilters = ({ filters }: Props) => {
  const activeLabels = useFilterStore((state) => state.activeLabels);
  const options = filters.filter(
    (config) =>
      !activeLabels.has(config.label) && !config.label.toLowerCase().includes('order'),
  );

  return (
    <FilterItemPopover
      trigger={
        <Button disabled size='xs' variant='ghost' className='h-7 text-muted-foreground'>
          <ListFilterPlusIcon className='size-4' />
          More Filters
        </Button>
      }
    >
      <Command>
        <CommandInput placeholder='Search filters...' />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {options.map((config) => (
              <MoreFiltersItem key={config.label} config={config} />
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </FilterItemPopover>
  );
};
