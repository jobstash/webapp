'use client';

import { FILTER_KIND } from '@/lib/filters/core/constants';
import { FilterConfigItemSchema } from '@/lib/filters/core/schemas';

import { FilterItemPopover } from '@/lib/filters/ui/filter-item-popover';

import { SuggestedFiltersContentMapper } from './mapper';
import { SuggestedFiltersTrigger } from './trigger';

interface Props {
  config: FilterConfigItemSchema;
}

export const SuggestedFiltersItem = ({ config }: Props) => {
  const isPopover = config.kind !== FILTER_KIND.SWITCH;

  return (
    <FilterItemPopover
      trigger={<SuggestedFiltersTrigger config={config} isPopover={isPopover} />}
    >
      <SuggestedFiltersContentMapper config={config} />
    </FilterItemPopover>
  );
};
