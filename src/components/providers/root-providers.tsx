'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';

export const RootProviders = ({ children }: React.PropsWithChildren) => {
  return <NuqsAdapter>{children}</NuqsAdapter>;
};
