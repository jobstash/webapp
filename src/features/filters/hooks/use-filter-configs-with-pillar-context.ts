import type { PillarFilterContext } from '@/features/pillar/schemas';
import { FILTER_KIND } from '@/features/filters/constants';
import type { FilterConfigSchema } from '@/features/filters/schemas';

export const useFilterConfigsWithPillarContext = (
  configs: FilterConfigSchema[],
  pillarContext: PillarFilterContext | null | undefined,
): FilterConfigSchema[] => {
  if (!pillarContext) return configs;

  return configs.map((config) => {
    const isConfigWithOptions =
      config.kind !== FILTER_KIND.RANGE && config.kind !== FILTER_KIND.SWITCH;

    if (!isConfigWithOptions || config.paramKey !== pillarContext.paramKey) {
      return config;
    }

    return {
      ...config,
      options: config.options.filter(
        (option) => option.value !== pillarContext.value,
      ),
    };
  });
};
