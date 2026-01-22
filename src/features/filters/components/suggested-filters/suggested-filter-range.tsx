'use client';

import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { useRangeFilterState } from '@/features/filters/hooks/use-range-filter-state';
import { MappedFilterIcon } from '@/features/filters/components/mapped-filter-icon';
import type { RangeFilterConfig } from '@/features/filters/schemas';
import {
  calculateSliderStep,
  formatRangeValue,
  formatRangeValueShort,
} from '@/features/filters/utils';

import { SuggestedFilterTrigger } from './suggested-filter-trigger';

interface Props {
  config: RangeFilterConfig;
}

export const SuggestedFilterRange = ({ config }: Props) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { label, lowest, highest, prefix } = config;

  const { localValues, displayValues, setLocalValues, apply, canApply } =
    useRangeFilterState({
      lowestParamKey: lowest.paramKey,
      highestParamKey: highest.paramKey,
      defaultLowest: lowest.value,
      defaultHighest: highest.value,
    });

  const step = calculateSliderStep(lowest.value, highest.value);

  const handleApply = () => {
    setOpen(false);
    startTransition(() => {
      apply();
    });
  };

  const formattedMin = formatRangeValueShort(displayValues[0], prefix);
  const formattedMax = formatRangeValueShort(displayValues[1], prefix);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={isPending} asChild>
        <SuggestedFilterTrigger
          isPending={isPending}
          label={label}
          icon={<MappedFilterIcon paramKey={lowest.paramKey} />}
        />
      </PopoverTrigger>
      <PopoverContent
        side='bottom'
        align='start'
        className='flex w-64 flex-col gap-4 p-4'
      >
        <div className='flex items-center justify-between text-sm'>
          <span className='text-muted-foreground'>{formattedMin}</span>
          <span className='text-muted-foreground'>{formattedMax}</span>
        </div>

        <Slider
          min={lowest.value}
          max={highest.value}
          step={step}
          value={localValues}
          onValueChange={(values) => setLocalValues(values as [number, number])}
        />

        <div className='flex items-center justify-between text-xs text-muted-foreground'>
          <span>{formatRangeValue(lowest.value, prefix)}</span>
          <span>{formatRangeValue(highest.value, prefix)}</span>
        </div>

        <Button
          size='sm'
          onClick={handleApply}
          disabled={!canApply}
          className='w-full'
        >
          Apply
        </Button>
      </PopoverContent>
    </Popover>
  );
};
