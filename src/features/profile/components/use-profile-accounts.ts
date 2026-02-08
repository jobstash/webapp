'use client';

import { useLinkAccount } from '@privy-io/react-auth';
import { useQueryClient } from '@tanstack/react-query';

import { GoogleIcon } from '@/components/svg/google-icon';
import {
  LINKED_ACCOUNTS_QUERY_KEY,
  useLinkedAccounts,
} from '@/features/profile/hooks/use-linked-accounts';

const ACCOUNT_TYPES = [
  {
    type: 'google_oauth' as const,
    label: 'Google',
    icon: GoogleIcon,
  },
];

export const useProfileAccounts = () => {
  const { data: linkedAccounts, isPending } = useLinkedAccounts();
  const queryClient = useQueryClient();

  const { linkGoogle } = useLinkAccount({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LINKED_ACCOUNTS_QUERY_KEY,
      });
    },
  });

  const accounts = ACCOUNT_TYPES.map((account) => {
    const linked = linkedAccounts?.find((a) => a.type === account.type);

    return {
      ...account,
      isConnected: !!linked,
      connectedEmail: linked?.email ?? null,
    };
  });

  return { accounts, isLoading: isPending, linkGoogle };
};
