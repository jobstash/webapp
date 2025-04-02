'use client';

import { ChevronDownIcon, XIcon } from 'lucide-react';

import { Button } from '@/lib/shared/ui/base/button';

import { useFilterStore } from './store';

interface Props {
  label: string;
  itemLabel: string;
  icon?: React.ReactNode;
}

export const ActiveFilterItem = ({ label, itemLabel, icon }: Props) => {
  const removeActiveFilter = useFilterStore((state) => state.removeActiveFilter);
  const onRemove = () => removeActiveFilter(label);
  return (
    <div className='flex overflow-hidden rounded-md'>
      <div>
        <Button
          size='xs'
          variant='secondary'
          className='group flex h-7 items-center gap-1.5 rounded-r-none border-r-0 px-2 text-sm hover:bg-neutral-700/50 [&_svg]:text-neutral-400'
          onClick={onRemove}
        >
          <div className='grid size-6 shrink-0 place-items-center'>
            <div className='group-hover:hidden'>{icon}</div>
            <XIcon className='hidden h-4 w-4 group-hover:block' />
          </div>
          {label}
        </Button>
      </div>
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
