import { useActiveFilterLabels } from '@/features/filters/hooks';
import { type FilterConfigSchema } from '@/features/filters/schemas';

export const useSuggestedFilters = (
  configs: FilterConfigSchema[],
): FilterConfigSchema[] => {
  const activeLabels = useActiveFilterLabels(configs);
  return configs.filter(
    (config) => config.isSuggested && !activeLabels.has(config.label),
  );
};
