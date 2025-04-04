'use client';

import { ChevronDownIcon } from 'lucide-react';

import { MultiSelectFilterConfigSchema } from '@/lib/filters/core/schemas';

import { Button } from '@/lib/shared/ui/base/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/lib/shared/ui/base/popover';

import { getActiveFilterValueLabel } from './get-active-filter-value-label';
import { VirtualMultiselectDropdown } from './virtual-multiselect-filter-dropdown';

interface Props {
  config: MultiSelectFilterConfigSchema;
  filterParamValue: string;
}

export const MultiselectFilterDropdown = ({ config, filterParamValue }: Props) => {
  const label = getActiveFilterValueLabel(config, filterParamValue);

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
        <VirtualMultiselectDropdown config={config} />
      </PopoverContent>
    </Popover>
  );
};
