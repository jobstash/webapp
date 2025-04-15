'use client';

import { XIcon } from 'lucide-react';
import { useQueryState } from 'nuqs';

import { FilterConfigSchema } from '@/lib/filters/core/schemas';

import { cn } from '@/lib/shared/utils';

import { Button } from '@/lib/shared/ui/base/button';
import { filterIconMap } from '@/lib/filters/ui/filter-icon-map';

interface Props {
  config: FilterConfigSchema;
  hasDropdown: boolean;
}

export const MainTrigger = ({ config, hasDropdown }: Props) => {
  const [, setFilterParam] = useQueryState(config.paramKey);
  const onClick = () => setFilterParam(null);
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
      onClick={onClick}
    >
      <div className='grid size-6 shrink-0 place-items-center'>
        <div className='group-hover:hidden'>{filterIconMap[config.paramKey]}</div>
        <XIcon className='hidden h-4 w-4 group-hover:block' />
      </div>
      {config.label}
    </Button>
  );
};
