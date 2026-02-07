'use client';

import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { SearchIcon } from 'lucide-react';

interface Props {
  children: ReactNode;
}

const handleSearchError = (error: unknown): void => {
  console.error('[SearchHeader] Failed to load search:', error);
};

export const SearchHeaderBoundary = ({ children }: Props) => (
  <ErrorBoundary
    fallback={
      <div className='pointer-events-none flex min-w-0 grow items-center gap-2 opacity-50'>
        <SearchIcon className='size-6 shrink-0 text-zinc-500' />
        <span className='text-muted-foreground'>Search...</span>
      </div>
    }
    onError={handleSearchError}
  >
    {children}
  </ErrorBoundary>
);
