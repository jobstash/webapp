import { useQueryState } from 'nuqs';
import { useProgress } from '@bprogress/next';

export const useFilterQueryState = (paramKey: string) => {
  const { start } = useProgress();
  const [filterParam, setFilterParam] = useQueryState(paramKey);
  const [, setPage] = useQueryState('page');

  const setFilterWithPageReset = (value: string | null) => {
    start();
    setPage(null);
    return setFilterParam(value);
  };

  return [filterParam, setFilterWithPageReset] as const;
};
