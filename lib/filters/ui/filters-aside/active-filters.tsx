'use client';
import { FilterItemConfigMapper } from './filter-item-config-mapper';
import { useFilterStore } from './store';

export const ActiveFilters = () => {
  const activeFilters = useFilterStore((state) => state.activeFilters);
  return (
    <>
      {activeFilters.map((config) => (
        <FilterItemConfigMapper key={config.label} config={config} />
      ))}
    </>
  );
};
