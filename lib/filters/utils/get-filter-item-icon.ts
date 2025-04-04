import { FILTER_KIND } from '@/lib/filters/core/constants';
import { FilterConfigItemSchema } from '@/lib/filters/core/schemas';

import { getFilterParamKey } from '@/lib/filters/utils/get-filter-param-key';

import { filterIconMap } from '@/lib/filters/ui/filter-icon-map';

export const getFilterItemIcon = (config: FilterConfigItemSchema) => {
  const isRange = config.kind === FILTER_KIND.RANGE;
  const iconKey = getFilterParamKey(config);
  const icon = filterIconMap[iconKey];
  return { icon, iconKey, isRange };
};
