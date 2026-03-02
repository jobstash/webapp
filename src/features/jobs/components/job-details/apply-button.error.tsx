'use client';

import type { ReactNode } from 'react';

import { AppErrorBoundary } from '@/features/error-reporter/app-error-boundary';

interface Props {
  children: ReactNode;
}

export const ApplyButtonBoundary = ({ children }: Props) => (
  <AppErrorBoundary fallback={null}>{children}</AppErrorBoundary>
);
