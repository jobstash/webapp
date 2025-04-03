'use client';

import { ChevronDownIcon } from 'lucide-react';
import { useQueryState } from 'nuqs';

import { RadioFilterConfigSchema } from '@/lib/filters/core/schemas';

import { Button } from '@/lib/shared/ui/base/button';
import { Label } from '@/lib/shared/ui/base/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/lib/shared/ui/base/popover';
import { RadioGroup, RadioGroupItem } from '@/lib/shared/ui/base/radio-group';

import { getActiveFilterValueLabel } from './get-active-filter-value-label';

interface Props {
  config: RadioFilterConfigSchema;
  filterParamValue: string;
}

export const RadioFilterDropdown = ({ config, filterParamValue }: Props) => {
  const label = getActiveFilterValueLabel(config, filterParamValue);
  const [filterParam, setFilterParam] = useQueryState(config.paramKey);

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
        <RadioGroup
          className='flex flex-col gap-2'
          value={filterParam ?? undefined}
          onValueChange={setFilterParam}
        >
          {config.options.map(({ value, label }) => (
            <div key={value} className='flex items-center space-x-2'>
              <RadioGroupItem id={value} value={value} />
              <Label htmlFor={value} className='text-muted-foreground'>
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </PopoverContent>
    </Popover>
  );
};
