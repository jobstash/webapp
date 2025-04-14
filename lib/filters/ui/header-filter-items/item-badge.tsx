'use client';

import { XIcon } from 'lucide-react';
import { useQueryState } from 'nuqs';

import { useFilterStore } from '@/lib/filters/core/store';

import { Badge } from '@/lib/shared/ui/base/badge';

import { ItemBadgeProps } from './types';

export const ItemBadge = ({
  paramKey,
  label,
  csvParamValue,
  filterLabel,
}: ItemBadgeProps) => {
  const [filterParam, setFilterParam] = useQueryState(paramKey);
  const removeActiveFilter = useFilterStore((state) => state.removeActiveFilter);

  const onClick = () => {
    let newValue: string | null = null;
    if (filterParam && csvParamValue && filterLabel) {
      const values = filterParam.split(',');
      const newValues = values.filter((value) => value !== csvParamValue);
      const hasNewValues = newValues.length > 0;
      newValue = hasNewValues ? newValues.join(',') : null;
    }

    setFilterParam(newValue);
    if (!newValue) {
      removeActiveFilter(filterLabel);
    }
  };

  return (
    <Badge variant='secondary' className='shrink-0 rounded-sm pr-1 pl-2'>
      {label}
      <button
        type='button'
        className='ml-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-neutral-700 hover:text-white'
        aria-label={`Remove ${label}`}
        onClick={onClick}
      >
        <XIcon className='h-3 w-3' />
      </button>
    </Badge>
  );
};
