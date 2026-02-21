'use client';

import { GithubIcon } from 'lucide-react';

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
  {
    type: 'github_oauth' as const,
    label: 'GitHub',
    icon: GithubIcon,
  },
];

const LINK_HANDLERS = {
  google_oauth: 'linkGoogle',
  github_oauth: 'linkGithub',
} as const;

export const useProfileAccounts = () => {
  const { data: linkedAccounts, isPending } = useLinkedAccounts();
  const queryClient = useQueryClient();

  const { linkGoogle, linkGithub } = useLinkAccount({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LINKED_ACCOUNTS_QUERY_KEY,
      });
    },
  });

  const linkFns = { linkGoogle, linkGithub } as Record<string, () => void>;

  const accounts = ACCOUNT_TYPES.map((account) => {
    const linked = linkedAccounts?.find((a) => a.type === account.type);
    const handlerName = LINK_HANDLERS[account.type];

    return {
      ...account,
      isConnected: !!linked,
      subtitle: linked ? (linked.username ?? linked.email ?? null) : null,
      onLink: linkFns[handlerName],
    };
  });

  return { accounts, isLoading: isPending };
};
