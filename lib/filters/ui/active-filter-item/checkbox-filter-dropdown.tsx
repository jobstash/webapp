'use client';

import { ChevronDownIcon } from 'lucide-react';

import { CheckboxFilterConfigSchema } from '@/lib/filters/core/schemas';

import { Button } from '@/lib/shared/ui/base/button';
import { Checkbox } from '@/lib/shared/ui/base/checkbox';
import { Label } from '@/lib/shared/ui/base/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/lib/shared/ui/base/popover';

import { getActiveFilterValueLabel } from './get-active-filter-value-label';
import { useCsvFilterParams } from './use-csv-filter-params';

interface Props {
  config: CheckboxFilterConfigSchema;
  filterParamValue: string;
}

export const CheckboxFilterDropdown = ({ config, filterParamValue }: Props) => {
  const label = getActiveFilterValueLabel(config, filterParamValue);
  const { isActiveParam, toggleItem } = useCsvFilterParams(config.paramKey, config.label);
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
        className='relative flex w-fit min-w-32 flex-col gap-2 bg-muted'
      >
        {config.options.map(({ value, label }) => (
          <div key={label} className='flex items-center space-x-2'>
            <Checkbox
              value={value}
              checked={isActiveParam(value)}
              onCheckedChange={(checked) => toggleItem(value, checked)}
            />
            <Label htmlFor={value} className='text-muted-foreground'>
              {label}
            </Label>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};
