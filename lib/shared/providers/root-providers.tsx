'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { ReactQueryProvider } from './react-query-provider';
import { ThemeProvider } from './theme-provider';

import { LazyAuthProvider } from '@/lib/auth/providers';

export const RootProviders = ({ children }: React.PropsWithChildren) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='dark' disableTransitionOnChange>
      <NuqsAdapter>
        <ReactQueryProvider>
          <LazyAuthProvider>{children}</LazyAuthProvider>
        </ReactQueryProvider>
      </NuqsAdapter>
    </ThemeProvider>
  );
};
