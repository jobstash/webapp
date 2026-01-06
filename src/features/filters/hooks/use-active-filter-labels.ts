import { type FilterConfigSchema } from '@/features/filters/schemas';

import { useActiveFilters } from './use-active-filters';

export const useActiveFilterLabels = (configs: FilterConfigSchema[]) => {
  const activeFilters = useActiveFilters(configs);
  return new Set(activeFilters.map((filter) => filter.label));
};
