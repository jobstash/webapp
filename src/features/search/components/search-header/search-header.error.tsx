'use client';

import type { ReactNode } from 'react';
import { SearchIcon } from 'lucide-react';

import { AppErrorBoundary } from '@/features/error-reporter/app-error-boundary';

interface Props {
  children: ReactNode;
}

export const SearchHeaderBoundary = ({ children }: Props) => (
  <AppErrorBoundary
    fallback={
      <div className='pointer-events-none flex min-w-0 grow items-center gap-2 opacity-50'>
        <SearchIcon className='size-6 shrink-0 text-zinc-500' />
        <span className='text-muted-foreground'>Search...</span>
      </div>
    }
  >
    {children}
  </AppErrorBoundary>
);
