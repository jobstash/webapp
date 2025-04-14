import { useEffect, useState } from 'react';

import { FILTER_KIND } from '@/lib/filters/core/constants';
import { FilterConfigItemSchema } from '@/lib/filters/core/schemas';

import { useActiveFilterItemParams } from '@/lib/filters/ui/active-filter-item/use-active-filter-item-params';

export const useInitFilterParams = (config: FilterConfigItemSchema) => {
  const [initialized, setInitialized] = useState(false);
  const { filterParam, setFilterParam, setRangeFilterParams } =
    useActiveFilterItemParams(config);

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
    if (!filterParam) {
      switch (config.kind) {
        case FILTER_KIND.RANGE:
          const min = config.min.value.toString();
          const max = config.max.value.toString();
          setRangeFilterParams(min, max);
          break;
        case FILTER_KIND.SWITCH:
          setFilterParam('true');
          break;
        case FILTER_KIND.RADIO:
        case FILTER_KIND.CHECKBOX:
        case FILTER_KIND.SINGLE_SELECT:
        case FILTER_KIND.MULTI_SELECT:
          if (!initialized) setFilterParam(config.options[0].value);
          break;
        default:
          break;
      }
    }
  }, [initialized, filterParam, setFilterParam, config, setRangeFilterParams]);

  return { filterParamValue: filterParam };
};
