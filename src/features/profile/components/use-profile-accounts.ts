'use client';

import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';

import { useProgress } from '@bprogress/next';
import { useRouter } from '@bprogress/next/app';
import { GithubIcon, MailIcon, WalletIcon } from 'lucide-react';

import { useLinkAccount } from '@privy-io/react-auth';
import { useQueryClient } from '@tanstack/react-query';

// TODO: Farcaster temporarily hidden
// import { FarcasterIcon } from '@/components/svg/farcaster-icon';
import { GoogleIcon } from '@/components/svg/google-icon';
import { JOB_APPLY_STATUS_KEY } from '@/features/jobs/components/job-details/use-job-apply-status';
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
  { type: 'email', label: 'Email', icon: MailIcon, isEnabled: true },
  { type: 'wallet', label: 'Wallet', icon: WalletIcon, isEnabled: true },
  // TODO: Farcaster temporarily hidden
  // {
  //   type: 'farcaster',
  //   label: 'Farcaster',
  //   icon: FarcasterIcon,
  //   isEnabled: false,
  // },
];

const PROVIDER_MAP: Record<string, string> = {
  google_oauth: 'google',
  github_oauth: 'github',
  email: 'email',
};

export const useProfileAccounts = () => {
  const router = useRouter();
  const { start } = useProgress();
  const { data: linkedAccounts, isPending } = useLinkedAccounts();
  const queryClient = useQueryClient();
  const [linkingType, setLinkingType] = useState<string | null>(null);

  const { linkWallet } = useLinkAccount({
    onSuccess: () => {
      setLinkingType(null);
      queryClient.invalidateQueries({ queryKey: LINKED_ACCOUNTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [JOB_APPLY_STATUS_KEY] });
    },
    onError: () => {
      setLinkingType(null);
    },
  });

  // Clear linking state when the linked account appears in cache
  useEffect(() => {
    if (!linkingType || !linkedAccounts) return;

    const isNowLinked = linkedAccounts.some((a) => a.type === linkingType);
    if (isNowLinked) {
      setLinkingType(null);
    }
  }, [linkingType, linkedAccounts]);

  // Build account items: for most types, one entry per ACCOUNT_TYPES config.
  // For wallets, show each connected wallet as its own read-only pill,
  // plus always show a "Wallet" button to link another.
  const connectedWallets = (linkedAccounts ?? []).filter(
    (a) => a.type === 'wallet',
  );

  const accounts = ACCOUNT_TYPES.flatMap((account) => {
    if (account.type === 'wallet') {
      const walletPills = connectedWallets.map((w) => ({
        ...account,
        key: `wallet-${w.username}`,
        isConnected: true,
        isLinking: false,
        subtitle: w.username
          ? `${w.username.slice(0, 6)}...${w.username.slice(-4)}`
          : null,
        onLink: () => {},
      }));

      const linkPill = {
        ...account,
        key: 'wallet-link',
        isConnected: false,
        isLinking: linkingType === 'wallet',
        subtitle: null,
        onLink: () => {
          setLinkingType('wallet');
          linkWallet();
        },
      };

      return [...walletPills, linkPill];
    }

    const linked = linkedAccounts?.find((a) => a.type === account.type);

    return [
      {
        ...account,
        key: account.type,
        isConnected: !!linked,
        isLinking: linkingType === account.type,
        subtitle: linked ? (linked.username ?? linked.email ?? null) : null,
        onLink: () => {
          const provider = PROVIDER_MAP[account.type];
          if (!provider) return;
          setLinkingType(account.type);
          start();
          router.push(`/link?provider=${provider}`);
        },
      },
    ];
  }).sort((a, b) => {
    const priority = (item: typeof a) => {
      if (!item.isEnabled) return 2;
      if (item.isConnected) return 0;
      return 1;
    };
    return priority(a) - priority(b);
  });

  return { accounts, isPending, isLinking: !!linkingType };
};
