import { useSearchParams } from 'next/navigation';

import { FILTER_KIND } from '@/features/filters/constants';
import { type FilterConfigSchema } from '@/features/filters/schemas';

export const useActiveFilters = (configs: FilterConfigSchema[]) => {
  const searchParams = useSearchParams();
  return configs.filter(
    (config) =>
      searchParams.get(config.paramKey) && config.kind !== FILTER_KIND.SORT,
  );
};
