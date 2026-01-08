import { type FilterConfigSchema } from '@/features/filters/schemas';
import { useActiveFilterLabels } from '@/features/filters/hooks';

export const useMoreFiltersOptions = (configs: FilterConfigSchema[]) => {
  const activeLabels = useActiveFilterLabels(configs);
  return configs.filter((config) => {
    const isActive = activeLabels.has(config.label);
    const isOrder = config.label.toLowerCase().includes('order');
    return !isActive && !isOrder;
  });
};
