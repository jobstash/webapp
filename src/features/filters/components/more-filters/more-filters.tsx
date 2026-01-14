'use client';

import { useState, useTransition } from 'react';
import { ListFilterPlusIcon, LoaderIcon } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from '@/components/ui/command';
import { FILTER_KIND } from '@/features/filters/constants';
import { type FilterConfigSchema } from '@/features/filters/schemas';

import { MoreFiltersItem } from './more-filters-item';
import { useMoreFiltersOptions } from './use-more-filters-options';

interface Props {
  configs: FilterConfigSchema[];
}

export const MoreFilters = ({ configs }: Props) => {
  const options = useMoreFiltersOptions(configs);
  const [open, setOpen] = useState(false);
  const closeDropdown = () => setOpen(false);
  const [isPending, startTransition] = useTransition();
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={isPending} asChild>
        <Button
          size='xs'
          variant='secondary'
          className='flex h-7 items-center gap-1.5 bg-sidebar text-muted-foreground/80 hover:bg-muted'
          disabled={isPending}
        >
          <div className='grid size-4 place-items-center'>
            {isPending ? (
              <LoaderIcon className='shrink-0 animate-spin text-neutral-400' />
            ) : (
              <ListFilterPlusIcon className='size-4' />
            )}
          </div>
          <span className='flex-1 text-left'>More Filters</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side='bottom'
        align='start'
        className='relative flex w-fit max-w-60 min-w-32 flex-col gap-2 border-neutral-800 p-0'
      >
        <Command>
          <CommandInput placeholder='Search filters...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((config) => (
                <MoreFiltersItem
                  key={config.label}
                  isPending={isPending}
                  paramKey={config.paramKey}
                  label={config.label}
                  defaultValue={getDefaultValue(config)}
                  closeDropdown={closeDropdown}
                  startTransition={startTransition}
                />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const getDefaultValue = (config: FilterConfigSchema): string | null => {
  switch (config.kind) {
    case FILTER_KIND.SWITCH:
      return 'true';
    case FILTER_KIND.RADIO:
    case FILTER_KIND.CHECKBOX:
    case FILTER_KIND.SEARCH:
    case FILTER_KIND.REMOTE_SEARCH:
      return config.options[0].value;
    default:
      return null;
  }
};
