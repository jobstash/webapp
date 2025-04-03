'use client';

import { useFilterStore } from '@/lib/filters/core/store';

import { ActiveFilterItem } from './active-filter-item';

export const ActiveFilters = () => {
  const activeFilters = useFilterStore((state) => state.activeFilters);
  return (
    <>
      {activeFilters.map((config) => (
        <ActiveFilterItem key={config.label} config={config} />
      ))}
    </>
  );
};
