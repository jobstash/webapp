'use client';

import { PropsWithChildren } from 'react';

import { PrivyProvider as BaseProvider } from '@privy-io/react-auth';

import { CLIENT_ENVS } from '@/lib/shared/core/client.env';

export const PrivyProvider = ({ children }: PropsWithChildren) => {
  return (
    <BaseProvider
      appId={CLIENT_ENVS.PRIVY_APP_ID}
      clientId={CLIENT_ENVS.PRIVY_CLIENT_ID}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#676FF6',
          logo: '/privy-logo.png',
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'off',
          },
        },
      }}
    >
      {children}
    </BaseProvider>
  );
};
