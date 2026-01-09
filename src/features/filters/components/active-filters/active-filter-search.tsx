'use client';

import { useState, useTransition } from 'react';
import { CheckIcon } from 'lucide-react';

import { type Option } from '@/lib/types';
import { capitalizeSlug } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CommandGroup, CommandItem } from '@/components/ui/command';
import { VirtualizedCommand } from '@/components/virtualized-command';
import { MappedFilterIcon } from '@/features/filters/components/mapped-filter-icon';

import { ActiveFilterTrigger } from './active-filter-trigger';
import { useCsvParam } from './use-csv-param';

interface Props {
  label: string;
  paramKey: string;
  options: Option[];
}

export const ActiveFiltersSearch = ({ label, paramKey, options }: Props) => {
  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);

  const { filterParam, values, checkIsActive, toggleItem, setFilterParam } =
    useCsvParam(paramKey);

  const handleSelect = (value: string, checked: boolean) => {
    setOpen(false);
    startTransition(() => {
      toggleItem(value, checked);
    });
  };

  const handleClose = () => {
    startTransition(() => {
      setFilterParam(null);
    });
  };

  const dedupedOptions = options.filter(
    (option) => !checkIsActive(option.value),
  );

  const selectedOptions = (filterParam?.split(',') || []).map((paramValue) => ({
    label: capitalizeSlug(paramValue),
    value: paramValue,
  }));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={isPending} asChild>
        <ActiveFilterTrigger
          isPending={isPending}
          label={`${label} (${values.length})`}
          tooltipLabel={label}
          icon={<MappedFilterIcon paramKey={paramKey} />}
          onClose={handleClose}
        />
      </PopoverTrigger>
      <PopoverContent
        side='bottom'
        align='start'
        className='relative flex w-fit max-w-60 min-w-32 flex-col gap-2 border-neutral-800 p-0'
      >
        <VirtualizedCommand
          options={dedupedOptions}
          placeholder={`Search ${label.toLowerCase()}...`}
          onSelect={(value) => handleSelect(value, true)}
          beforeItems={
            <CommandGroup heading='Selected'>
              {selectedOptions.map(({ label, value }) => (
                <CommandItem
                  key={label}
                  onSelect={() => handleSelect(value, false)}
                  className='data-[selected=true]:bg-white/5'
                >
                  <CheckIcon className='size-3.5 text-primary' />
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
          }
        />
      </PopoverContent>
    </Popover>
  );
};
