'use client';

import { useQueryState } from 'nuqs';
import { XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FilterIcon } from '@/features/filters/components/filter-icon';

interface Props {
  label: string;
  paramKey: string;
  hasDropdown: boolean;
}

export const ActiveFilterLabelButton = ({
  label,
  paramKey,
  hasDropdown,
}: Props) => {
  const [, setSearchParam] = useQueryState(paramKey);
  const unsetSearchParam = () => setSearchParam(null);

  return (
    <Button
      size='xs'
      variant='secondary'
      className={cn(
        'group flex h-7 items-center gap-1.5 px-2 pr-3.5 text-sm hover:bg-neutral-700/50 [&_svg]:text-neutral-400',
        {
          'rounded-r-none border-r-0 pr-3': hasDropdown,
        },
      )}
      onClick={unsetSearchParam}
    >
      <div className='grid size-6 shrink-0 place-items-center'>
        <div className='group-hover:hidden'>
          <FilterIcon paramKey={paramKey} />
        </div>
        <XIcon className='hidden h-4 w-4 group-hover:block' />
      </div>
      {label}
    </Button>
  );
};
