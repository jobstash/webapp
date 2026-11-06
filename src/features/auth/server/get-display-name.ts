import 'server-only';

import type { User } from '@privy-io/node';

import { extractExternalWallets } from '@/lib/server/privy';

export type IdentityType = 'github' | 'google' | 'email' | 'wallet';

interface DisplayIdentity {
  displayName: string;
  identityType: IdentityType;
}

const truncateAddress = (addr: string) =>
  `${addr.slice(0, 6)}...${addr.slice(-4)}`;

const resolveIdentity = (
  user: User,
  method: string,
): DisplayIdentity | null => {
  if (method === 'github') {
    const account = user.linked_accounts.find(
      (account) => account.type === 'github_oauth',
    );
    if (account?.username) {
      return { displayName: account.username, identityType: 'github' };
    }
  }
  if (method === 'google') {
    const account = user.linked_accounts.find(
      (account) => account.type === 'google_oauth',
    );
    if (account?.email) {
      return { displayName: account.email, identityType: 'google' };
    }
  }
  if (method === 'email') {
    const account = user.linked_accounts.find(
      (account) => account.type === 'email',
    );
    if (account?.address) {
      return { displayName: account.address, identityType: 'email' };
    }
  }
  if (method === 'wallet') {
    const externalWallet = extractExternalWallets(user)[0]?.address;
    if (externalWallet) {
      return {
        displayName: truncateAddress(externalWallet),
        identityType: 'wallet',
      };
    }
  }
  return null;
};

const FALLBACK_ORDER = ['github', 'google', 'email', 'wallet'] as const;

export const getDisplayName = (
  user: User,
  loginMethod?: string,
): DisplayIdentity | null => {
  if (loginMethod) {
    const match = resolveIdentity(user, loginMethod);
    if (match) return match;
  }

  for (const method of FALLBACK_ORDER) {
    const match = resolveIdentity(user, method);
    if (match) return match;
  }

  return null;
};
