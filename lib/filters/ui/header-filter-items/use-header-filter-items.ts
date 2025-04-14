import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { FILTER_KIND } from '@/lib/filters/core/constants';
import { useFilterStore } from '@/lib/filters/core/store';

import { getFilterParamKey } from '@/lib/filters/utils/get-filter-param-key';
import { getLabelByOptionValue } from '@/lib/filters/utils/get-label-by-option-value';

import { ItemBadgeProps } from './types';

export const useHeaderFilterItems = () => {
  const { activeFilters } = useFilterStore();
  const searchParams = useSearchParams();

  const items = useMemo(() => {
    const results: ItemBadgeProps[] = [];

    for (const item of activeFilters) {
      switch (item.kind) {
        // TODO: case FILTER_KIND.RANGE
        case FILTER_KIND.SINGLE_SELECT:
        case FILTER_KIND.MULTI_SELECT:
        case FILTER_KIND.RADIO:
        case FILTER_KIND.CHECKBOX: {
          const paramKey = getFilterParamKey(item);
          const searchParamValue = searchParams.get(paramKey);
          if (searchParamValue) {
            const values = searchParamValue.split(',');
            for (const csvParamValue of values) {
              const label = getLabelByOptionValue(item.options, csvParamValue);
              if (label) {
                results.push({ paramKey, csvParamValue, label, filterLabel: item.label });
              }
            }
          }
          break;
        }
        case FILTER_KIND.SWITCH: {
          const paramKey = getFilterParamKey(item);
          const searchParamValue = searchParams.get(paramKey);
          if (searchParamValue) {
            results.push({ paramKey, label: item.label, filterLabel: item.label });
          }
        }
      }
    }

    return results;
  }, [activeFilters, searchParams]);

  return items;
};
