'use client';

import { type TransitionStartFunction } from 'react';

import { Button } from '@/components/ui/button';
import { CommandItem } from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { MappedFilterIcon } from '@/features/filters/components/mapped-filter-icon';
import type { RangeFilterConfig } from '@/features/filters/schemas';

import { useMoreFiltersRangeItem } from './use-more-filters-range-item';

interface Props {
  isPending: boolean;
  config: RangeFilterConfig;
  closeDropdown: () => void;
  startTransition: TransitionStartFunction;
}

export const MoreFiltersRangeItem = (props: Props) => {
  const { isPending, config, closeDropdown, startTransition } = props;

  const {
    open,
    setOpen,
    value,
    setValue,
    formattedLow,
    formattedHigh,
    canApply,
    handleApply,
  } = useMoreFiltersRangeItem({ config, closeDropdown, startTransition });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <CommandItem
          className='hover:cursor-pointer'
          disabled={isPending}
          onSelect={() => setOpen(true)}
        >
          <div className='flex items-center gap-2'>
            <div className='grid size-4 place-items-center'>
              <MappedFilterIcon paramKey={config.lowest.paramKey} />
            </div>
            {config.label}
          </div>
        </CommandItem>
      </PopoverTrigger>
      <PopoverContent
        side='right'
        align='start'
        className='w-64 border-neutral-800 p-4'
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between text-sm'>
            <span className='text-muted-foreground'>{formattedLow}</span>
            <span className='text-muted-foreground'>{formattedHigh}</span>
          </div>
          <Slider
            min={config.lowest.value}
            max={config.highest.value}
            value={value}
            onValueChange={(v) => setValue(v as [number, number])}
          />
          <Button size='sm' onClick={handleApply} disabled={!canApply}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
