import 'server-only';

import { PrivyClient, User, WalletWithMetadata } from '@privy-io/server-auth';

import { clientEnv } from '@/lib/env/client';
import { serverEnv } from '@/lib/env/server';

const privyClient = new PrivyClient(
  clientEnv.PRIVY_APP_ID,
  serverEnv.PRIVY_APP_SECRET,
);

export const verifyPrivyToken = (token: string) =>
  privyClient.verifyAuthToken(token);

export const getPrivyUser = (did: string) => privyClient.getUser(did);

const isPrivyWallet = (a: { type: string }): a is WalletWithMetadata =>
  a.type === 'wallet' && (a as WalletWithMetadata).walletClientType === 'privy';

export const extractEmbeddedWallet = (user: User): string | undefined =>
  user.linkedAccounts?.find(isPrivyWallet)?.address;

export const extractExternalWallets = (user: User): WalletWithMetadata[] =>
  (user.linkedAccounts ?? []).filter(
    (a): a is WalletWithMetadata =>
      a.type === 'wallet' && a.walletClientType !== 'privy',
  );
