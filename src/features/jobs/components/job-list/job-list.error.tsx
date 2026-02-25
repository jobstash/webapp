'use client';

import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AlertCircle, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

const handleJobListError = (error: unknown): void => {
  console.error('[JobList]', error);
};

export const JobListBoundary = ({ children }: Props) => (
  <ErrorBoundary
    fallbackRender={({ resetErrorBoundary }) => (
      <div className='flex flex-col items-center justify-center gap-4 py-20 text-center'>
        <AlertCircle className='size-10 text-destructive' />
        <div className='space-y-1'>
          <p className='text-lg font-medium'>Failed to load jobs</p>
          <p className='text-sm text-muted-foreground'>Please try again</p>
        </div>
        <Button variant='outline' size='sm' onClick={resetErrorBoundary}>
          <RefreshCw className='size-4' />
          Try again
        </Button>
      </div>
    )}
    onError={handleJobListError}
  >
    {children}
  </ErrorBoundary>
);
