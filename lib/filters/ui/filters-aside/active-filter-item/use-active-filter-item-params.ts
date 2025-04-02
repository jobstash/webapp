import { useQueryState } from 'nuqs';

import { FILTER_KIND } from '@/lib/filters/core/constants';
import { FilterConfigItemSchema } from '@/lib/filters/core/schemas';

export const useActiveFilterItemParams = (config: FilterConfigItemSchema) => {
  const isRange = config.kind === FILTER_KIND.RANGE;

  const paramKey = isRange ? config.min.paramKey : config.paramKey;
  const paramKey2 = isRange ? config.max.paramKey : '';

  const [filterParam, setFilterParam] = useQueryState(paramKey);
  const [filterParam2, setFilterParam2] = useQueryState(paramKey2);

  const setRangeFilterParams = (min: string | null, max: string | null) => {
    setFilterParam(min);
    setFilterParam2(max);
  };

  return {
    isRange,
    paramKey,
    filterParam,
    filterParam2,
    setFilterParam,
    setRangeFilterParams,
  };
};
