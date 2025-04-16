import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { FILTER_KIND } from '@/lib/filters/core/constants';
import { FilterConfigSchema } from '@/lib/filters/core/schemas';

export const useActiveFilters = (filterConfigs: FilterConfigSchema[]) => {
  const searchParams = useSearchParams();

  const activeFilters = useMemo(() => {
    return filterConfigs.filter((filter) => {
      return searchParams.get(filter.paramKey) && filter.kind !== FILTER_KIND.SORT;
    });
  }, [filterConfigs, searchParams]);

  const activeLabels = useMemo(() => {
    return new Set(activeFilters.map((filter) => filter.label));
  }, [activeFilters]);

  return { activeFilters, activeLabels };
};
