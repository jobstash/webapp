'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

const handleJobListError = (error: Error) => {
  console.error('[JobList] Failed to load jobs:', error);
};

export const JobListBoundary = ({ children, fallback }: Props) => (
  <ErrorBoundary fallback={fallback} onError={handleJobListError}>
    {children}
  </ErrorBoundary>
);
