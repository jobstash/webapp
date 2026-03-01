'use client';

import type { ErrorInfo } from 'react';
import { ErrorBoundary, type ErrorBoundaryProps } from 'react-error-boundary';

import { reportError } from './reporter';

type Props = ErrorBoundaryProps & {
  onError?: (error: Error, info: ErrorInfo) => void;
};

export const AppErrorBoundary = ({ onError, ...props }: Props) => (
  <ErrorBoundary
    onError={(error, info) => {
      reportError(error);
      onError?.(error, info);
    }}
    {...props}
  />
);
