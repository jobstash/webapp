import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { FilterConfigSchema } from '@/lib/filters/core/schemas';

export const useActiveFilters = (filterConfigs: FilterConfigSchema[]) => {
  const searchParams = useSearchParams();

  const activeFilters = useMemo(() => {
    return filterConfigs.filter((filter) => {
      return searchParams.get(filter.paramKey);
    });
  }, [filterConfigs, searchParams]);

  const activeLabels = useMemo(() => {
    return new Set(activeFilters.map((filter) => filter.label));
  }, [activeFilters]);

  return { activeFilters, activeLabels };
};
