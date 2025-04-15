import { FilterConfigSchema } from '@/lib/filters/core/schemas';

import { useActiveFilters } from '@/lib/filters/hooks/use-active-filters';

export const useMoreFilters = (configs: FilterConfigSchema[]) => {
  const { activeLabels } = useActiveFilters(configs);
  const options = configs.filter((config) => {
    const isActive = activeLabels.has(config.label);
    const isOrder = config.label.toLowerCase().includes('order');
    return !isActive && !isOrder;
  });

  return { options };
};
