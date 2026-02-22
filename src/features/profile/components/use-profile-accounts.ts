'use client';

import type { ComponentType } from 'react';

import { GithubIcon, MailIcon, WalletIcon } from 'lucide-react';

import { useLinkAccount } from '@privy-io/react-auth';
import { useQueryClient } from '@tanstack/react-query';

import { FarcasterIcon } from '@/components/svg/farcaster-icon';
import { GoogleIcon } from '@/components/svg/google-icon';
import {
  LINKED_ACCOUNTS_QUERY_KEY,
  useLinkedAccounts,
} from '@/features/profile/hooks/use-linked-accounts';

interface AccountConfig {
  type: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  isEnabled: boolean;
}

const ACCOUNT_TYPES: AccountConfig[] = [
  { type: 'google_oauth', label: 'Google', icon: GoogleIcon, isEnabled: true },
  { type: 'github_oauth', label: 'GitHub', icon: GithubIcon, isEnabled: true },
  { type: 'wallet', label: 'Wallet', icon: WalletIcon, isEnabled: false },
  { type: 'email', label: 'Email', icon: MailIcon, isEnabled: false },
  {
    type: 'farcaster',
    label: 'Farcaster',
    icon: FarcasterIcon,
    isEnabled: false,
  },
];

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

  const linkFns: Record<string, () => void> = {
    google_oauth: linkGoogle,
    github_oauth: linkGithub,
  };

  const accounts = ACCOUNT_TYPES.map((account) => {
    const linked = linkedAccounts?.find((a) => a.type === account.type);

    return {
      ...account,
      isConnected: !!linked,
      subtitle: linked ? (linked.username ?? linked.email ?? null) : null,
      onLink: linkFns[account.type],
    };
  });

  return { accounts, isLoading: isPending };
};
