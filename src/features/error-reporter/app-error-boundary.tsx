'use client';

import type { ErrorInfo } from 'react';
import * as Sentry from '@sentry/nextjs';
import { ErrorBoundary, type ErrorBoundaryProps } from 'react-error-boundary';

type Props = ErrorBoundaryProps & {
  onError?: (error: Error, info: ErrorInfo) => void;
};

export const AppErrorBoundary = ({ onError, ...props }: Props) => (
  <ErrorBoundary
    onError={(error, info) => {
      Sentry.captureException(error, {
        contexts: { react: { componentStack: info.componentStack } },
      });
      onError?.(error, info);
    }}
    {...props}
  />
);
