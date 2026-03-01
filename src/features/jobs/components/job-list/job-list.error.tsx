'use client';

import type { ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AppErrorBoundary } from '@/features/error-reporter/app-error-boundary';

interface Props {
  children: ReactNode;
}

export const JobListBoundary = ({ children }: Props) => (
  <AppErrorBoundary
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
  >
    {children}
  </AppErrorBoundary>
);
