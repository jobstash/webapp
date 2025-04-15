import { FilterConfigSchema } from '@/lib/filters/core/schemas';

import { getFilterParamKey } from '@/lib/filters/utils/get-filter-param-key';

import { filterIconMap } from '@/lib/filters/ui/filter-icon-map';

export const useFilterIcon = (config: FilterConfigSchema) => {
  const iconKey = getFilterParamKey(config);
  const icon = filterIconMap[iconKey];
  return { icon, iconKey };
};
