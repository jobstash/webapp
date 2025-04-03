'use client';

import { XIcon } from 'lucide-react';

import { FILTER_KIND } from '@/lib/filters/core/constants';
import { FilterConfigItemSchema } from '@/lib/filters/core/schemas';
import { useFilterStore } from '@/lib/filters/core/store';

import { cn } from '@/lib/shared/utils';

import { Button } from '@/lib/shared/ui/base/button';
import { filterIconMap } from '@/lib/filters/ui/filter-icon-map';

import { useActiveFilterItemParams } from './use-active-filter-item-params';

interface Props {
  config: FilterConfigItemSchema;
}

export const MainButton = ({ config }: Props) => {
  const isSwitch = config.kind === FILTER_KIND.SWITCH;
  const { isRange, paramKey, setFilterParam, setRangeFilterParams } =
    useActiveFilterItemParams(config);

  const removeActiveFilter = useFilterStore((state) => state.removeActiveFilter);
  const onRemove = () => {
    removeActiveFilter(config.label);
    if (isRange) {
      setRangeFilterParams(null, null);
    } else {
      setFilterParam(null);
    }
  };
  return (
    <Button
      size='xs'
      variant='secondary'
      className={cn(
        'group flex h-7 items-center gap-1.5 px-2 pr-3.5 text-sm hover:bg-neutral-700/50 [&_svg]:text-neutral-400',
        {
          'rounded-r-none border-r-0 pr-3': !isSwitch,
        },
      )}
      onClick={onRemove}
    >
      <div className='grid size-6 shrink-0 place-items-center'>
        <div className='group-hover:hidden'>{filterIconMap[paramKey]}</div>
        <XIcon className='hidden h-4 w-4 group-hover:block' />
      </div>
      {config.label}
    </Button>
  );
};
