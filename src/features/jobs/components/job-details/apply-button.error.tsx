'use client';

import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface Props {
  children: ReactNode;
}

const handleApplyError = (error: unknown): void => {
  console.error('[ApplyButton] Failed to load:', error);
};

export const ApplyButtonBoundary = ({ children }: Props) => (
  <ErrorBoundary fallback={null} onError={handleApplyError}>
    {children}
  </ErrorBoundary>
);
