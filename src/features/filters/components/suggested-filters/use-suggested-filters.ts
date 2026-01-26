import { useSearchParams } from 'next/navigation';

import { FILTER_KIND } from '@/features/filters/constants';
import { useActiveFilterLabels } from '@/features/filters/hooks';
import { type FilterConfigSchema } from '@/features/filters/schemas';

export const useSuggestedFilters = (
  configs: FilterConfigSchema[],
): FilterConfigSchema[] => {
  const searchParams = useSearchParams();
  const activeLabels = useActiveFilterLabels(configs);

  return configs.filter((config) => {
    if (!config.isSuggested) return false;

    // For range filters, check if NEITHER param is set
    if (config.kind === FILTER_KIND.RANGE) {
      const hasLowest = searchParams.has(config.lowest.paramKey);
      const hasHighest = searchParams.has(config.highest.paramKey);
      return !(hasLowest || hasHighest);
    }

    // For other filters, use existing active labels logic
    return !activeLabels.has(config.label);
  });
};
