import { useSearchParams } from 'next/navigation';

import { FILTER_KIND } from '@/features/filters/constants';
import { useActiveFilterLabels } from '@/features/filters/hooks';
import { usePillarFilterMode } from '@/features/filters/hooks/use-pillar-filter-mode';
import { type FilterConfigSchema } from '@/features/filters/schemas';

export const useSuggestedFilters = (
  configs: FilterConfigSchema[],
): FilterConfigSchema[] => {
  const searchParams = useSearchParams();
  const pillarMode = usePillarFilterMode();
  const activeLabels = useActiveFilterLabels(configs);

  return configs.filter((config) => {
    if (!config.isSuggested) return false;

    // For range filters, check if NEITHER param is set. Ranges are never
    // mock-active in pillar mode, and stray query params on a static pillar
    // URL must not hide them.
    if (config.kind === FILTER_KIND.RANGE) {
      if (pillarMode) return true;
      const hasLowest = searchParams.has(config.lowest.paramKey);
      const hasHighest = searchParams.has(config.highest.paramKey);
      return !(hasLowest || hasHighest);
    }

    // For other filters, use existing active labels logic
    return !activeLabels.has(config.label);
  });
};
