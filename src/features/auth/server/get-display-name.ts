import 'server-only';

import type { User } from '@privy-io/server-auth';

export type IdentityType = 'github' | 'email' | 'wallet';

interface DisplayIdentity {
  displayName: string;
  identityType: IdentityType;
}

/**
 * Derive a display identity from a Privy user's linked accounts.
 * Priority: GitHub username → Google email → email → truncated wallet.
 */
export const getDisplayName = (user: User): DisplayIdentity | null => {
  if (user.github?.username) {
    return { displayName: user.github.username, identityType: 'github' };
  }
  if (user.google?.email) {
    return { displayName: user.google.email, identityType: 'email' };
  }
  if (user.email?.address) {
    return { displayName: user.email.address, identityType: 'email' };
  }
  if (user.wallet?.address) {
    const addr = user.wallet.address;
    return {
      displayName: `${addr.slice(0, 6)}...${addr.slice(-4)}`,
      identityType: 'wallet',
    };
  }
  return null;
};
