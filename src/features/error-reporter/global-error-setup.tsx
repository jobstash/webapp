'use client';

import { useEffect } from 'react';

import { initReporter, reportError } from './reporter';

export const GlobalErrorSetup = () => {
  useEffect(() => {
    const cleanupReporter = initReporter();

    const handleError = (e: ErrorEvent): void => {
      if (e.error instanceof Error) reportError(e.error);
    };

    const handleRejection = (e: PromiseRejectionEvent): void => {
      const error =
        e.reason instanceof Error
          ? e.reason
          : new Error(String(e.reason ?? 'Unhandled rejection'));
      reportError(error);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      cleanupReporter();
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return null;
};
