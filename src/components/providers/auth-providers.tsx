'use client';

import { PrivyClientProvider } from './privy-provider';

export const AuthProviders = ({ children }: React.PropsWithChildren) => {
  return <PrivyClientProvider>{children}</PrivyClientProvider>;
};
