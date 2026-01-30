import { Suspense } from 'react';
import { SearchIcon } from 'lucide-react';

import { SearchHeaderClient } from './search-header.client';
import { SearchHeaderBoundary } from './search-header.error';

const SearchHeaderFallback = () => (
  <div className='pointer-events-none flex min-w-0 grow items-center gap-2 opacity-50'>
    <SearchIcon className='size-6 shrink-0 text-zinc-500' />
    <span className='text-muted-foreground'>Search...</span>
  </div>
);

export const SearchHeader = () => (
  <SearchHeaderBoundary>
    <Suspense fallback={<SearchHeaderFallback />}>
      <SearchHeaderClient />
    </Suspense>
  </SearchHeaderBoundary>
);
