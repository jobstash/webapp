'use client';

import { useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { AppErrorBoundary } from './app-error-boundary';

const ThrowOnRender = () => {
  throw new Error('Test error from ThrowOnRender');
};

export const TestErrorBoundary = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  return (
    <div className='flex flex-col items-center gap-6'>
      <Button variant='destructive' onClick={() => setShouldThrow(true)}>
        Throw Error
      </Button>

      <AppErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div className='flex flex-col items-center gap-4 rounded-lg border border-destructive/50 bg-destructive/5 p-6'>
            <AlertCircle className='size-8 text-destructive' />
            <div className='space-y-1 text-center'>
              <p className='font-medium'>Error caught and reported</p>
              <p className='text-sm text-muted-foreground'>
                {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </div>
            <Button variant='outline' size='sm' onClick={resetErrorBoundary}>
              <RefreshCw className='size-4' />
              Reset
            </Button>
          </div>
        )}
        onReset={() => setShouldThrow(false)}
      >
        {shouldThrow && <ThrowOnRender />}
      </AppErrorBoundary>
    </div>
  );
};
