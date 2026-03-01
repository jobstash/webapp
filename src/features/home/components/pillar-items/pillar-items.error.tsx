'use client';

import type { ReactNode } from 'react';

import { AppErrorBoundary } from '@/features/error-reporter/app-error-boundary';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

export const PillarItemsBoundary = ({ children, fallback }: Props) => (
  <AppErrorBoundary fallback={fallback}>{children}</AppErrorBoundary>
);
