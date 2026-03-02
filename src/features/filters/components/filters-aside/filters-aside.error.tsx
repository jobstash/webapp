'use client';

import type { ReactNode } from 'react';

import { AppErrorBoundary } from '@/features/error-reporter/app-error-boundary';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

export const FiltersAsideBoundary = ({ children, fallback }: Props) => (
  <AppErrorBoundary fallback={fallback}>{children}</AppErrorBoundary>
);
