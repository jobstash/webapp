import { FilterConfigSchema } from '@/lib/filters/core/schemas';

export const getFilterParamKey = (config: FilterConfigSchema) =>
  // config.kind === FILTER_KIND.RANGE ? config.min.paramKey : config.paramKey;
  config.paramKey;
