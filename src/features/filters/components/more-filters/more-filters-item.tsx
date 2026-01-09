'use client';

import { type TransitionStartFunction } from 'react';

import { CommandItem } from '@/components/ui/command';
import { useFilterQueryState } from '@/features/filters/hooks';
import { MappedFilterIcon } from '@/features/filters/components/mapped-filter-icon';

interface Props {
  isPending: boolean;
  paramKey: string;
  label: string;
  defaultValue: string | null;
  closeDropdown: () => void;
  startTransition: TransitionStartFunction;
}

export const MoreFiltersItem = (props: Props) => {
  const {
    isPending,
    paramKey,
    label,
    defaultValue,
    closeDropdown,
    startTransition,
  } = props;

  const [, setFilterParam] = useFilterQueryState(paramKey);

  const onSelect = () => {
    closeDropdown();
    startTransition(() => {
      setFilterParam(defaultValue);
    });
  };

  return (
    <CommandItem
      key={label}
      className='hover:cursor-pointer'
      onSelect={onSelect}
      disabled={isPending}
    >
      <div className='flex items-center gap-2'>
        <div className='grid size-4 place-items-center'>
          {<MappedFilterIcon paramKey={paramKey} />}
        </div>
        {label}
      </div>
    </CommandItem>
  );
};
