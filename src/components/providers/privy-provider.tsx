'use client';

import { PrivyProvider } from '@privy-io/react-auth';

import { clientEnv } from '@/lib/env/client';

export const PrivyClientProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <PrivyProvider
      appId={clientEnv.PRIVY_APP_ID}
      clientId={clientEnv.PRIVY_CLIENT_ID}
      config={{
        loginMethods: ['wallet', 'github', 'google', 'email'],
        appearance: {
          theme: 'dark',
          accentColor: '#8743FF',
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'all-users',
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
};
