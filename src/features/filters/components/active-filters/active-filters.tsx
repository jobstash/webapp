'use client';

import { useActiveFilters } from '@/features/filters/hooks';
import { type FilterConfigSchema } from '@/features/filters/schemas';

import { ActiveFilter } from './active-filter';

interface Props {
  configs: FilterConfigSchema[];
}

export const ActiveFilters = ({ configs }: Props) => {
  const activeFilters = useActiveFilters(configs);
  return (
    <>
      {activeFilters.map((filter) => (
        <ActiveFilter key={filter.label} config={filter} />
      ))}
    </>
  );
};
