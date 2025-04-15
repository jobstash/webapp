import { useMemo } from 'react';

import { FilterConfigSchema } from '@/lib/filters/core/schemas';

import { useActiveFilters } from '@/lib/filters/hooks/use-active-filters';

export const useSuggestedFilters = (configs: FilterConfigSchema[]) => {
  const { activeLabels } = useActiveFilters(configs);

  const suggestedFilters = useMemo(() => {
    return configs.filter(
      (config) => config.isSuggested && !activeLabels.has(config.label),
    );
  }, [configs, activeLabels]);

  return suggestedFilters;
};
