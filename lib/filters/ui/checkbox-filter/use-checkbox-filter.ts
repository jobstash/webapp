import { useCallback, useMemo } from 'react';

import { CheckedState } from '@radix-ui/react-checkbox';
import { useQueryState } from 'nuqs';

export function useCheckboxFilter(paramKey: string) {
  const [filterParam, setFilterParam] = useQueryState(paramKey);

  const selectedValues = useMemo(() => {
    return filterParam ? filterParam.split(',') : [];
  }, [filterParam]);

  const isItemChecked = useCallback(
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
    },
    [selectedValues, filterParam, setFilterParam],
  );

  return {
    selectedValues,
    isItemChecked,
    toggleItem,
  };
}
