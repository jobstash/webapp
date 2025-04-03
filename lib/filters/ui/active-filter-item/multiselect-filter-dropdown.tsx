'use client';

import { useMemo } from 'react';

import { ChevronDownIcon, SearchCheckIcon } from 'lucide-react';

import { MultiSelectFilterConfigSchema } from '@/lib/filters/core/schemas';

import { cn } from '@/lib/shared/utils';

import { Button } from '@/lib/shared/ui/base/button';
import { CommandGroup, CommandItem } from '@/lib/shared/ui/base/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/lib/shared/ui/base/popover';
import { VirtualizedCommand } from '@/lib/shared/ui/virtualized-command';

import { getActiveFilterValueLabel } from './get-active-filter-value-label';
import { useCsvFilterParams } from './use-csv-filter-params';

interface Props {
  config: MultiSelectFilterConfigSchema;
  filterParamValue: string;
}

export const MultiselectFilterDropdown = ({ config, filterParamValue }: Props) => {
  const label = getActiveFilterValueLabel(config, filterParamValue);
  const { isActiveParam, toggleItem } = useCsvFilterParams(config.paramKey, config.label);

  const options = useMemo(() => {
    return config.options.filter((option) => {
      return !isActiveParam(option.value);
    });
  }, [config.options, isActiveParam]);

  const selectedOptions = useMemo(() => {
    return config.options.filter((option) => isActiveParam(option.value));
  }, [config.options, isActiveParam]);

  const onToggleItem = (value: string, nextState: boolean) => {
    toggleItem(value, nextState);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size='xs'
          variant='secondary'
          className='flex h-7 items-center gap-1.5 rounded-l-none border-l-0 px-2 text-sm hover:bg-neutral-700/50'
        >
          {label}
          <ChevronDownIcon className='size-3.5 text-neutral-400' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side='bottom'
        align='start'
        className='relative flex w-52 flex-col gap-2 bg-muted p-0'
      >
        <VirtualizedCommand
          options={options}
          placeholder={`Search ${config.label.toLowerCase()} ...`}
          onSelect={(value) => onToggleItem(value, true)}
          beforeItems={
            <CommandGroup heading='Selected'>
              {selectedOptions.map(({ label, value }, index) => (
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
          }
        />
      </PopoverContent>
    </Popover>
  );
};
