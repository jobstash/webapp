'use client';

import { useState } from 'react';

import { ListFilterPlusIcon } from 'lucide-react';

import { FILTER_KIND } from '@/lib/filters/core/constants';
import { FilterConfigItemSchema } from '@/lib/filters/core/schemas';

import { Button } from '@/lib/shared/ui/base/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/lib/shared/ui/base/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/lib/shared/ui/base/popover';
import { filterIconMap } from '@/lib/filters/ui/filter-icon-map';

import { useFilterStore } from './store';
interface Props {
  filters: FilterConfigItemSchema[];
}

export const MoreFilters = ({ filters }: Props) => {
  const [open, setOpen] = useState(false);
  const activeLabels = useFilterStore((state) => state.activeLabels);
  const addActiveFilter = useFilterStore((state) => state.addActiveFilter);
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
              {options.map((config) => {
                const { label, kind } = config;
                const iconKey =
                  kind === FILTER_KIND.RANGE ? config.min.paramKey : config.paramKey;
                const icon = filterIconMap[iconKey];
                return (
                  <CommandItem
                    key={label}
                    className='hover:cursor-pointer'
                    onSelect={() => {
                      addActiveFilter(config);
                      setOpen(false);
                    }}
                  >
                    <div className='flex items-center gap-2'>
                      <div className='grid size-4 place-items-center'>{icon}</div>
                      {label}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
