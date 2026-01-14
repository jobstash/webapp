'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

const handleFilterError = (error: Error) => {
  console.error('[FiltersAside] Failed to load filters:', error);
};

export const FiltersAsideBoundary = ({ children, fallback }: Props) => (
  <ErrorBoundary fallback={fallback} onError={handleFilterError}>
    {children}
  </ErrorBoundary>
);
