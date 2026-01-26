import { Suspense } from 'react';

import { SearchHeaderClient } from './search-header.client';
import { SearchHeaderBoundary } from './search-header.error';
import { SearchHeaderSkeleton } from './search-header.skeleton';

export const SearchHeader = () => (
  <SearchHeaderBoundary>
    <Suspense fallback={<SearchHeaderSkeleton />}>
      <SearchHeaderClient />
    </Suspense>
  </SearchHeaderBoundary>
);
