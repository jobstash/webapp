import { useSearchParams } from 'next/navigation';

import { FILTER_KIND } from '@/features/filters/constants';
import { type FilterConfigSchema } from '@/features/filters/schemas';

import { usePillarFilterMode } from './use-pillar-filter-mode';

export const useActiveFilters = (configs: FilterConfigSchema[]) => {
  const searchParams = useSearchParams();
  const pillarMode = usePillarFilterMode();

  return configs.filter((config) => {
    if (config.kind === FILTER_KIND.SORT) return false;

    // Pillar mode: activeness comes from the pillar's implied criteria, not
    // the URL (the static pillar page ignores query params entirely).
    if (pillarMode) {
      if (config.kind === FILTER_KIND.RANGE) return false;
      return config.paramKey in pillarMode.baseParams;
    }

    if (config.kind === FILTER_KIND.RANGE) {
      const hasLowest = searchParams.has(config.lowest.paramKey);
      const hasHighest = searchParams.has(config.highest.paramKey);
      return hasLowest || hasHighest;
    }

    return searchParams.has(config.paramKey);
  });
};
