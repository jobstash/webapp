import 'server-only';

import { PrivyClient, type LinkedAccount, type User } from '@privy-io/node';

import { clientEnv } from '@/lib/env/client';
import { serverEnv } from '@/lib/env/server';

const privyClient = new PrivyClient({
  appId: clientEnv.PRIVY_APP_ID,
  appSecret: serverEnv.PRIVY_APP_SECRET,
});

export const verifyPrivyToken = (token: string) =>
  privyClient.utils().auth().verifyAccessToken(token);

export const getPrivyUser = (did: string) => privyClient.users()._get(did);

type WalletAccount = Extract<LinkedAccount, { type: 'wallet' }>;

const isPrivyWallet = (account: LinkedAccount): account is WalletAccount =>
  account.type === 'wallet' && account.wallet_client_type === 'privy';

export const extractEmbeddedWallet = (user: User): string | undefined =>
  user.linked_accounts.find(isPrivyWallet)?.address;

export const extractExternalWallets = (user: User): WalletAccount[] =>
  user.linked_accounts.filter(
    (account): account is WalletAccount =>
      account.type === 'wallet' && account.wallet_client_type !== 'privy',
  );
