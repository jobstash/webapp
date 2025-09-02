'use client';

import { createConfig, fallback, http, WagmiProvider as BaseProvider } from 'wagmi';
import { mainnet, optimism, polygon } from 'wagmi/chains';

import { CLIENT_ENVS } from '@/lib/shared/core/client.env';

const config = createConfig({
  chains: [mainnet, polygon, optimism],
  transports: {
    [mainnet.id]: fallback([
      http(`https://mainnet.infura.io/v3/${CLIENT_ENVS.INFURA_ID}`),
      http(),
    ]),
    [polygon.id]: fallback([http()]),
    [optimism.id]: fallback([http()]),
  },
  ssr: true,
});

interface Props {
  children: React.ReactNode;
}

export const WagmiProvider = ({ children }: Props) => (
  <BaseProvider config={config}>{children}</BaseProvider>
);
