import { useCallback, useMemo } from 'react';

import { CheckedState } from '@radix-ui/react-checkbox';
import { useQueryState } from 'nuqs';

import { useFilterStore } from '@/lib/filters/core/store';

export const useCsvFilterParams = (paramKey: string, label: string) => {
  const removeActiveFilter = useFilterStore((state) => state.removeActiveFilter);
  const [filterParam, setFilterParam] = useQueryState(paramKey);

  const selectedValues = useMemo(() => {
    return filterParam ? filterParam.split(',') : [];
  }, [filterParam]);

  const isActiveParam = useCallback(
    (itemKey: string): boolean => {
      return selectedValues.includes(itemKey);
    },
    [selectedValues],
  );

  const toggleItem = useCallback(
    (itemKey: string, checked: CheckedState) => {
      let newValues: string[];

      if (checked === true) {
        // Add item only if it's not already present
        newValues = selectedValues.includes(itemKey)
          ? selectedValues
          : [...selectedValues, itemKey];
      } else {
        // Remove item (handles checked === false or checked === 'indeterminate')
        newValues = selectedValues.filter((value) => value !== itemKey);
      }

      const newFilterParam = newValues.length > 0 ? newValues.join(',') : null;

      // Only update if the value has actually changed
      if (newFilterParam !== filterParam) {
        setFilterParam(newFilterParam);
      }

      if (newFilterParam === null) {
        removeActiveFilter(label);
      }
    },
    [selectedValues, filterParam, setFilterParam, removeActiveFilter, label],
  );

  return {
    filterParam,
    selectedValues,
    isActiveParam,
    toggleItem,
  };
};
