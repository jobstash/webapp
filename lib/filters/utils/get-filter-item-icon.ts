import { FILTER_KIND } from '@/lib/filters/core/constants';

import { filterIconMap } from '@/lib/filters/ui/filter-icon-map';

import { FilterConfigItemSchema } from '../core/schemas';

export const getFilterItemIcon = (config: FilterConfigItemSchema) => {
  const isRange = config.kind === FILTER_KIND.RANGE;
  const iconKey = isRange ? config.min.paramKey : config.paramKey;
  const icon = filterIconMap[iconKey];
  return { icon, iconKey, isRange };
};
