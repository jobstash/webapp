'use client';

import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/lib/shared/ui/base/button';

interface Props {
  label: string;
  itemLabel: string;
  icon?: React.ReactNode;
}

export const ActiveFilterItem = ({ label, itemLabel, icon }: Props) => {
  return (
    <div className='flex overflow-hidden rounded-md'>
      <Button
        size='xs'
        variant='secondary'
        className='flex h-7 items-center gap-1.5 rounded-r-none border-r-0 px-2 text-sm hover:bg-neutral-700/50 [&_svg]:text-neutral-400'
      >
        <div className='h-4 shrink-0'>{icon}</div>
        {label}
      </Button>
      <div className='flex items-center bg-secondary'>
        <div className='h-4 w-px bg-neutral-600/60'></div>
      </div>
      <Button
        size='xs'
        variant='secondary'
        className='flex h-7 items-center gap-1.5 rounded-l-none border-l-0 px-2 text-sm hover:bg-neutral-700/50'
      >
        {itemLabel}
        <ChevronDownIcon className='size-3.5 text-neutral-400' />
      </Button>
    </div>
  );
};
