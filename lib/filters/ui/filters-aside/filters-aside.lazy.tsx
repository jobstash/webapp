import { Suspense } from 'react';

import { FiltersAside } from './filters-aside';
import { FiltersAsideSkeleton } from './skeleton';

export const LazyFiltersAside = () => (
  <Suspense fallback={<FiltersAsideSkeleton />}>
    <FiltersAside />
  </Suspense>
);
