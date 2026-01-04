import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { FiltersAsideFallback } from './fallback';
import { FiltersAside } from './filters-aside';
import { FiltersAsideSkeleton } from './skeleton';

export const LazyFiltersAside = () => (
  <Suspense fallback={<FiltersAsideSkeleton />}>
    <ErrorBoundary FallbackComponent={FiltersAsideFallback}>
      <FiltersAside />
    </ErrorBoundary>
  </Suspense>
);
