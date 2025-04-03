'use client';

import { useMemo } from 'react';

import { FilterConfigItemSchema } from '@/lib/filters/core/schemas';
import { useFilterStore } from '@/lib/filters/core/store';

import { SuggestedFiltersItem } from './item';

interface Props {
  filters: FilterConfigItemSchema[];
}

export const SuggestedFilters = ({ filters }: Props) => {
  const activeLabels = useFilterStore((state) => state.activeLabels);

  const suggestedFilters = useMemo(
    () =>
      filters.filter((config) => config.isSuggested && !activeLabels.has(config.label)),
    [filters, activeLabels],
  );

  if (suggestedFilters.length === 0) {
    return null;
  }

  return (
    <div className='flex flex-wrap gap-2'>
      {suggestedFilters.map((config) => (
        <SuggestedFiltersItem key={config.label} config={config} />
      ))}
    </div>
  );
};
