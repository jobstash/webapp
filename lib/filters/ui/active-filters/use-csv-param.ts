import { useQueryState } from 'nuqs';

const getNewValues = (values: string[], itemKey: string, checked: boolean) => {
  if (checked) {
    return values.includes(itemKey) ? values : [...values, itemKey];
  }
  return values.filter((value) => value !== itemKey);
};

export const useCsvParam = (paramKey: string) => {
  const [filterParam, setFilterParam] = useQueryState(paramKey);
  const values = filterParam ? filterParam.split(',') : [];

  const checkIsActive = (value: string) => values.includes(value);

  const toggleItem = (itemKey: string, checked: boolean) => {
    const newValues = getNewValues(values, itemKey, checked);
    const newFilterParam = newValues.length > 0 ? newValues.join(',') : null;
    if (newFilterParam !== filterParam) setFilterParam(newFilterParam);
  };

  return {
    filterParam,
    values,
    checkIsActive,
    toggleItem,
  };
};
