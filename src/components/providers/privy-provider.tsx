'use client';

import { PrivyProvider } from '@privy-io/react-auth';

import { clientEnv } from '@/lib/env/client';

export const PrivyClientProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <PrivyProvider
      appId={clientEnv.PRIVY_APP_ID}
      clientId={clientEnv.PRIVY_CLIENT_ID}
      config={{
        loginMethodsAndOrder: {
          primary: ['email', 'github', 'google', 'detected_ethereum_wallets'],
        },
        appearance: {
          theme: 'dark',
          accentColor: '#8743FF',
          logo: '/jobstash-logo.png',
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
