'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { FILTER_KIND } from '@/lib/filters/core/constants';
import { FilterConfigItemSchema } from '@/lib/filters/core/schemas';
import { useFilterStore } from '@/lib/filters/core/store';

import { FiltersAsideSkeleton } from '@/lib/filters/ui/filters-aside-skeleton';

interface Props extends React.PropsWithChildren {
  filters: FilterConfigItemSchema[];
}

export const FiltersInitWrapper = ({ filters, children }: Props) => {
  const searchParams = useSearchParams();

  const activeFiltersFromParams = filters.filter((filter) => {
    if (filter.kind === FILTER_KIND.RANGE) {
      return (
        searchParams.has(filter.min.paramKey) || searchParams.has(filter.max.paramKey)
      );
    }

    return searchParams.has(filter.paramKey);
  });

  const initialized = useFilterStore((state) => state.initialized);
  const setInitialized = useFilterStore((state) => state.setInitialized);
  const addActiveFilter = useFilterStore((state) => state.addActiveFilter);

  useEffect(() => {
    if (initialized) {
      return;
    }

    activeFiltersFromParams.forEach((filter) => {
      addActiveFilter(filter);
    });

    setInitialized(true);
  }, [activeFiltersFromParams, addActiveFilter, initialized, setInitialized]);

  if (!initialized) return <FiltersAsideSkeleton />;
  return <>{children}</>;
};
