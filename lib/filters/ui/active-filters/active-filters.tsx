'use client';

import { FilterConfigSchema } from '@/lib/filters/core/schemas';

import { useActiveFilters } from '@/lib/filters/hooks/use-active-filters';

import { ActiveFilterItem } from './active-filter-item';

interface Props {
  configs: FilterConfigSchema[];
}

export const ActiveFilters = ({ configs }: Props) => {
  const { activeFilters } = useActiveFilters(configs);
  return (
    <>
      {activeFilters.map((filter) => (
        <ActiveFilterItem key={filter.label} config={filter} />
      ))}
    </>
  );
};
