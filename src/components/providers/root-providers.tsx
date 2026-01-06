'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { ReactQueryProvider } from './react-query-provider';

export const RootProviders = ({ children }: React.PropsWithChildren) => {
  return (
    <NuqsAdapter>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </NuqsAdapter>
  );
};
