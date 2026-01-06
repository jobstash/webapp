'use client';

import { useQueryState } from 'nuqs';

import { CommandItem } from '@/components/ui/command';
import { filterIconMap } from '@/features/filters/components/filter-icon-map';

interface Props {
  paramKey: string;
  label: string;
  defaultValue: string | null;
  closeDropdown: () => void;
}

export const MoreFiltersItem = (props: Props) => {
  const { paramKey, label, defaultValue, closeDropdown } = props;

  const [, setFilterParam] = useQueryState(paramKey);
  const icon = filterIconMap[paramKey];

  const onSelect = () => {
    setFilterParam(defaultValue);
    closeDropdown();
  };

  return (
    <CommandItem
      key={label}
      className='hover:cursor-pointer'
      onSelect={onSelect}
    >
      <div className='flex items-center gap-2'>
        <div className='grid size-4 place-items-center'>{icon}</div>
        {label}
      </div>
    </CommandItem>
  );
};
