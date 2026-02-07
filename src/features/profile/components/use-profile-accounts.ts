'use client';

import { useLinkAccount } from '@privy-io/react-auth';
import { usePrivy } from '@privy-io/react-auth';

import { GoogleIcon } from '@/components/svg/google-icon';

const ACCOUNT_TYPES = [
  {
    type: 'google_oauth' as const,
    label: 'Google',
    icon: GoogleIcon,
  },
];

export const useProfileAccounts = () => {
  const { user, ready } = usePrivy();
  const { linkGoogle } = useLinkAccount();

  const accounts = ACCOUNT_TYPES.map((account) => {
    const linked = user?.linkedAccounts?.find((a) => a.type === account.type);

    const connectedEmail =
      linked && 'email' in linked ? (linked.email as string) : null;

    return {
      ...account,
      isConnected: !!linked,
      connectedEmail,
    };
  });

  return { accounts, isLoading: !ready, linkGoogle };
};
