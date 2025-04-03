'use client';

import { FilterConfigItemSchema } from '@/lib/filters/core/schemas';

import { FilterItemPopover } from '@/lib/filters/ui/filter-item-popover';

import { SuggestedFiltersContentMapper } from './mapper';
import { SuggestedFiltersTrigger } from './trigger';

interface Props {
  config: FilterConfigItemSchema;
}

export const SuggestedFiltersItem = ({ config }: Props) => {
  return (
    <FilterItemPopover trigger={<SuggestedFiltersTrigger config={config} />}>
      <SuggestedFiltersContentMapper config={config} />
    </FilterItemPopover>
  );
};
