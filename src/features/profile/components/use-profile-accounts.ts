'use client';

import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';

import { useProgress } from '@bprogress/next';
import { useRouter } from '@bprogress/next/app';
import { GithubIcon, MailIcon, WalletIcon } from 'lucide-react';

import type { User } from '@privy-io/react-auth';
import { usePrivy } from '@privy-io/react-auth';
import { useQueryClient } from '@tanstack/react-query';

import { FarcasterIcon } from '@/components/svg/farcaster-icon';
import { GoogleIcon } from '@/components/svg/google-icon';
import type { LinkedAccount } from '@/features/profile/schemas';
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

const PROVIDER_MAP: Record<string, string> = {
  google_oauth: 'google',
  github_oauth: 'github',
};

/** Derives LinkedAccount[] from Privy's client User object (mirrors API route logic). */
const privyUserToLinkedAccounts = (user: User): LinkedAccount[] => {
  const accounts: LinkedAccount[] = [];

  if (user.google) {
    accounts.push({
      type: 'google_oauth',
      email: user.google.email ?? null,
      username: null,
    });
  }

  if (user.github) {
    accounts.push({
      type: 'github_oauth',
      email: user.github.email ?? null,
      username: user.github.username ?? null,
    });
  }

  if (user.wallet) {
    accounts.push({
      type: 'wallet',
      email: null,
      username: user.wallet.address ?? null,
    });
  }

  if (user.email) {
    accounts.push({
      type: 'email',
      email: user.email.address ?? null,
      username: null,
    });
  }

  if (user.farcaster) {
    accounts.push({
      type: 'farcaster',
      email: null,
      username: user.farcaster.username ?? null,
    });
  }

  return accounts;
};

export const useProfileAccounts = () => {
  const router = useRouter();
  const { start } = useProgress();
  const { data: linkedAccounts, isPending } = useLinkedAccounts();
  const { ready, user } = usePrivy();
  const queryClient = useQueryClient();
  const [linkingType, setLinkingType] = useState<string | null>(null);

  // Dual-source sync: push Privy's client-side user into React Query cache
  useEffect(() => {
    if (!ready || !user) return;

    const derived = privyUserToLinkedAccounts(user);

    // Only sync if Privy has accounts (avoids overwriting with empty on initial load)
    if (derived.length === 0) return;

    queryClient.setQueryData<LinkedAccount[]>(
      LINKED_ACCOUNTS_QUERY_KEY,
      derived,
    );
  }, [ready, user, queryClient]);

  // Clear linking state when the linked account appears in cache
  useEffect(() => {
    if (!linkingType || !linkedAccounts) return;

    const isNowLinked = linkedAccounts.some((a) => a.type === linkingType);
    if (isNowLinked) {
      setLinkingType(null);
    }
  }, [linkingType, linkedAccounts]);

  const accounts = ACCOUNT_TYPES.map((account) => {
    const linked = linkedAccounts?.find((a) => a.type === account.type);

    return {
      ...account,
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
    };
  }).sort((a, b) => {
    const priority = (item: typeof a) => {
      if (!item.isEnabled) return 2;
      if (item.isConnected) return 0;
      return 1;
    };
    return priority(a) - priority(b);
  });

  return { accounts, isPending: isPending && !ready, isLinking: !!linkingType };
};
