import { useSearchParams } from 'next/navigation';

import { FILTER_KIND } from '@/features/filters/constants';
import { type FilterConfigSchema } from '@/features/filters/schemas';

export const useActiveFilters = (configs: FilterConfigSchema[]) => {
  const searchParams = useSearchParams();

  return configs.filter((config) => {
    if (config.kind === FILTER_KIND.SORT) return false;

    if (config.kind === FILTER_KIND.RANGE) {
      const hasLowest = searchParams.has(config.lowest.paramKey);
      const hasHighest = searchParams.has(config.highest.paramKey);
      return hasLowest || hasHighest;
    }

    return searchParams.has(config.paramKey);
  });
};
