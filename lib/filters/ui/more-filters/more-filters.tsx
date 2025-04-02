'use client';

import { useState } from 'react';

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
import { Popover, PopoverContent, PopoverTrigger } from '@/lib/shared/ui/base/popover';

import { MoreFiltersItem } from './more-filters-item';

interface Props {
  filters: FilterConfigItemSchema[];
}

export const MoreFilters = ({ filters }: Props) => {
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);
  const activeLabels = useFilterStore((state) => state.activeLabels);
  const options = filters.filter((config) => !activeLabels.has(config.label));
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size='xs' variant='ghost' className='h-7 text-muted-foreground'>
          <ListFilterPlusIcon className='size-4' />
          More Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side='bottom'
        align='start'
        className='w-48 min-w-60 bg-sidebar p-0'
      >
        <Command>
          <CommandInput placeholder='Search filters...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((config) => (
                <MoreFiltersItem key={config.label} config={config} onClose={onClose} />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
