'use client';

import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { SearchHeaderSkeleton } from './search-header.skeleton';

interface Props {
  children: ReactNode;
}

const handleSearchError = (error: Error): void => {
  console.error('[SearchHeader] Failed to load search:', error);
};

export const SearchHeaderBoundary = ({ children }: Props) => (
  <ErrorBoundary
    fallback={<SearchHeaderSkeleton />}
    onError={handleSearchError}
  >
    {children}
  </ErrorBoundary>
);
