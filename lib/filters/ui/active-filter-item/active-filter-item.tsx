'use client';

import { ChevronDownIcon } from 'lucide-react';

import { FILTER_KIND } from '@/lib/filters/core/constants';
import { FilterConfigItemSchema } from '@/lib/filters/core/schemas';

import { Button } from '@/lib/shared/ui/base/button';

import { MainButton } from './main-button';
import { useInitFilterParams } from './use-init-filter-params';

interface Props {
  config: FilterConfigItemSchema;
}

export const ActiveFilterItem = ({ config }: Props) => {
  const isSwitch = config.kind === FILTER_KIND.SWITCH;
  useInitFilterParams(config);

  return (
    <div className='flex overflow-hidden rounded-md'>
      <MainButton config={config} />
      {!isSwitch && (
        <>
          <div className='flex items-center bg-secondary'>
            <div className='h-4 w-px bg-neutral-600/60'></div>
          </div>
          <Button
            size='xs'
            variant='secondary'
            className='flex h-7 items-center gap-1.5 rounded-l-none border-l-0 px-2 text-sm hover:bg-neutral-700/50'
          >
            TODO
            <ChevronDownIcon className='size-3.5 text-neutral-400' />
          </Button>
        </>
      )}
    </div>
  );
};
