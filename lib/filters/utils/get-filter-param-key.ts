import { FILTER_KIND } from '@/lib/filters/core/constants';
import { FilterConfigItemSchema } from '@/lib/filters/core/schemas';

export const getFilterParamKey = (config: FilterConfigItemSchema) =>
  config.kind === FILTER_KIND.RANGE ? config.min.paramKey : config.paramKey;
