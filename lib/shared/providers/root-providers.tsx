'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { ReactQueryProvider } from './react-query-provider';
import { ThemeProvider } from './theme-provider';

import { LazyAuthProvider } from '@/lib/auth/providers';
import { WagmiProvider } from '@/lib/shared/providers/wagmi-provider';

export const RootProviders = ({ children }: React.PropsWithChildren) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='dark' disableTransitionOnChange>
      <NuqsAdapter>
        <WagmiProvider>
          <ReactQueryProvider>
            <LazyAuthProvider>{children}</LazyAuthProvider>
          </ReactQueryProvider>
        </WagmiProvider>
      </NuqsAdapter>
    </ThemeProvider>
  );
};
