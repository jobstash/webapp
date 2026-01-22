'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import type { RangeFilterConfig } from '@/features/filters/schemas';
import { MappedFilterIcon } from '@/features/filters/components/mapped-filter-icon';

import { ActiveFilterTrigger } from './active-filter-trigger';
import { useActiveFilterRange } from './use-active-filter-range';

interface Props {
  config: RangeFilterConfig;
}

export const ActiveFilterRange = ({ config }: Props) => {
  const {
    isOpen,
    isPending,
    canApply,
    localValues,
    setLocalValues,
    step,
    formattedMin,
    formattedMax,
    triggerLabel,
    handleApply,
    handleOpenChange,
    handleClose,
  } = useActiveFilterRange({ config });

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger disabled={isPending} asChild>
        <ActiveFilterTrigger
          isPending={isPending}
          label={triggerLabel}
          tooltipLabel={config.label}
          icon={<MappedFilterIcon paramKey={config.lowest.paramKey} />}
          onClose={handleClose}
        />
      </PopoverTrigger>
      <PopoverContent side='bottom' align='start' className='w-72'>
        <div className='space-y-4'>
          <div className='text-center font-medium'>
            {formattedMin} - {formattedMax}
          </div>

          <Slider
            value={localValues}
            onValueChange={(values) =>
              setLocalValues(values as [number, number])
            }
            min={config.lowest.value}
            max={config.highest.value}
            step={step}
          />

          <Button onClick={handleApply} disabled={!canApply} className='w-full'>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
