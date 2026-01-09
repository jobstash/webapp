import { useQueryState } from 'nuqs';

export const useFilterQueryState = (paramKey: string) => {
  const [filterParam, setFilterParam] = useQueryState(paramKey);
  const [, setPage] = useQueryState('page');

  const setFilterWithPageReset = (value: string | null) => {
    setPage(null);
    return setFilterParam(value);
  };

  return [filterParam, setFilterWithPageReset] as const;
};
