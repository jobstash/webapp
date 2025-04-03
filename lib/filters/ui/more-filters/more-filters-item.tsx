'use client';

import { FilterConfigItemSchema } from '@/lib/filters/core/schemas';
import { useFilterStore } from '@/lib/filters/core/store';

import { getFilterItemIcon } from '@/lib/filters/utils/get-filter-item-icon';

import { CommandItem } from '@/lib/shared/ui/base/command';
import { useFilterItemPopoverContext } from '@/lib/filters/ui/filter-item-popover';

interface Props {
  config: FilterConfigItemSchema;
}

export const MoreFiltersItem = ({ config }: Props) => {
  const { onClose } = useFilterItemPopoverContext();

  const { icon } = getFilterItemIcon(config);
  const addActiveFilter = useFilterStore((state) => state.addActiveFilter);
  return (
    <CommandItem
      key={config.label}
      className='hover:cursor-pointer'
      onSelect={() => {
        addActiveFilter(config);
        onClose();
      }}
    >
      <div className='flex items-center gap-2'>
        <div className='grid size-4 place-items-center'>{icon}</div>
        {config.label}
      </div>
    </CommandItem>
  );
};
