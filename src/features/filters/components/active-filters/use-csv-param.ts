import { useFilterQueryState } from '@/features/filters/hooks';

const getNewValues = (values: string[], value: string, checked: boolean) => {
  if (checked) {
    return values.includes(value) ? values : [...values, value];
  }
  return values.filter((v) => v !== value);
};

export const useCsvParam = (paramKey: string) => {
  const [filterParam, setFilterParam] = useFilterQueryState(paramKey);
  const values = filterParam ? filterParam.split(',') : [];

  const checkIsActive = (value: string) => values.includes(value);

  const toggleItem = (itemKey: string, checked: boolean) => {
    const newValues = getNewValues(values, itemKey, checked);
    const newFilterParam = newValues.length > 0 ? newValues.join(',') : null;
    if (newFilterParam !== filterParam) setFilterParam(newFilterParam);
  };

  return {
    filterParam,
    setFilterParam,
    values,
    checkIsActive,
    toggleItem,
  };
};
