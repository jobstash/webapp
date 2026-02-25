import 'server-only';

import type { User } from '@privy-io/server-auth';

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
  if (method === 'github' && user.github?.username) {
    return { displayName: user.github.username, identityType: 'github' };
  }
  if (method === 'google' && user.google?.email) {
    return { displayName: user.google.email, identityType: 'google' };
  }
  if (method === 'email' && user.email?.address) {
    return { displayName: user.email.address, identityType: 'email' };
  }
  if (method === 'wallet' && user.wallet?.address) {
    return {
      displayName: truncateAddress(user.wallet.address),
      identityType: 'wallet',
    };
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
