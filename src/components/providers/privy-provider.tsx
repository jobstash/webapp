'use client';

import { PrivyProvider } from '@privy-io/react-auth';

import { clientEnv } from '@/lib/env/client';

export const PrivyClientProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <PrivyProvider
      appId={clientEnv.PRIVY_APP_ID}
      config={{
        loginMethods: ['wallet', 'github', 'google', 'email'],
        appearance: {
          theme: 'dark',
          accentColor: '#8743FF',
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'off',
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
};
