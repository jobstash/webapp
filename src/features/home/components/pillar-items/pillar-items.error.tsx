'use client';

import { type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

const handlePillarError = (error: unknown) => {
  console.error('[PillarItems] Failed to load pillar items:', error);
};

export const PillarItemsBoundary = ({ children, fallback }: Props) => (
  <ErrorBoundary fallback={fallback} onError={handlePillarError}>
    {children}
  </ErrorBoundary>
);
