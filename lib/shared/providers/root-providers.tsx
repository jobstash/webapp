'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { ThemeProvider } from './theme-provider';

export const RootProviders = ({ children }: React.PropsWithChildren) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='dark' disableTransitionOnChange>
      <NuqsAdapter>{children}</NuqsAdapter>
    </ThemeProvider>
  );
};
