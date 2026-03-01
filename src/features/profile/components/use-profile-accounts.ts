'use client';

import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';

import { GithubIcon, MailIcon, WalletIcon } from 'lucide-react';

import type { LinkedAccountWithMetadata } from '@privy-io/react-auth';
import { useLinkAccount, usePrivy } from '@privy-io/react-auth';
import { useQueryClient } from '@tanstack/react-query';

import { GoogleIcon } from '@/components/svg/google-icon';
import { JOB_APPLY_STATUS_KEY } from '@/features/jobs/components/job-details/use-job-apply-status';

interface AccountConfig {
  type: string;
  label: string;
  connectedLabel: string;
  icon: ComponentType<{ className?: string }>;
  isEnabled: boolean;
}

const ACCOUNT_TYPES: AccountConfig[] = [
  {
    type: 'google_oauth',
    label: 'Link Google',
    connectedLabel: 'Google',
    icon: GoogleIcon,
    isEnabled: true,
  },
  {
    type: 'github_oauth',
    label: 'Link GitHub',
    connectedLabel: 'GitHub',
    icon: GithubIcon,
    isEnabled: true,
  },
  {
    type: 'email',
    label: 'Link Email',
    connectedLabel: 'Email',
    icon: MailIcon,
    isEnabled: true,
  },
  {
    type: 'wallet',
    label: 'Link Wallet',
    connectedLabel: 'Wallet',
    icon: WalletIcon,
    isEnabled: true,
  },
];

interface MappedAccount {
  type: string;
  display: string | null;
}

const mapPrivyAccounts = (
  linkedAccounts: LinkedAccountWithMetadata[],
): MappedAccount[] =>
  linkedAccounts
    .filter((account) => {
      // Filter out embedded wallets (Privy-managed)
      if (account.type === 'wallet') {
        return account.walletClientType !== 'privy';
      }
      return true;
    })
    .map((account): MappedAccount | null => {
      switch (account.type) {
        case 'google_oauth':
          return {
            type: 'google_oauth',
            display: account.email ?? account.name ?? null,
          };
        case 'github_oauth':
          return {
            type: 'github_oauth',
            display: account.username ?? account.email ?? null,
          };
        case 'email':
          return {
            type: 'email',
            display: account.address ?? null,
          };
        case 'wallet': {
          const addr = account.address;
          return {
            type: 'wallet',
            display: addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : null,
          };
        }
        default:
          return null;
      }
    })
    .filter((a): a is MappedAccount => a !== null);

export const useProfileAccounts = () => {
  const queryClient = useQueryClient();
  const [linkingType, setLinkingType] = useState<string | null>(null);
  const { user, ready, authenticated } = usePrivy();

  const privyAccounts = user?.linkedAccounts ?? [];
  const mapped = mapPrivyAccounts(privyAccounts);

  const { linkWallet, linkGithub, linkGoogle, linkEmail } = useLinkAccount({
    onSuccess: () => {
      setLinkingType(null);
      queryClient.invalidateQueries({ queryKey: [JOB_APPLY_STATUS_KEY] });
    },
    onError: () => {
      setLinkingType(null);
    },
  });

  // Clear linking state when the linked account appears
  useEffect(() => {
    if (!linkingType) return;

    const isNowLinked = mapped.some((a) => a.type === linkingType);
    if (isNowLinked) {
      setLinkingType(null);
    }
  }, [linkingType, mapped]);

  // Build account items
  const connectedWallets = mapped.filter((a) => a.type === 'wallet');

  const oauthLinkFns: Record<string, (() => void) | undefined> = {
    github_oauth: linkGithub,
    google_oauth: linkGoogle,
  };

  const accounts = ACCOUNT_TYPES.flatMap((account) => {
    if (account.type === 'wallet') {
      const walletPills = connectedWallets.map((w) => ({
        ...account,
        key: `wallet-${w.display}`,
        isConnected: true,
        isLinking: false,
        subtitle: w.display,
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

    const linked = mapped.find((a) => a.type === account.type);

    return [
      {
        ...account,
        key: account.type,
        isConnected: !!linked,
        isLinking: linkingType === account.type,
        subtitle: linked?.display ?? null,
        onLink: () => {
          setLinkingType(account.type);

          const linkFn = oauthLinkFns[account.type];
          if (linkFn) {
            linkFn();
            return;
          }

          // Email: Privy opens modal in-place
          if (account.type === 'email') {
            linkEmail();
          }
        },
      },
    ];
  }).sort((a, b) => {
    const priority = (item: typeof a): number => {
      if (!item.isEnabled) return 2;
      if (item.isConnected) return 0;
      return 1;
    };
    return priority(a) - priority(b);
  });

  const isPending = !ready || (authenticated && !user);

  return { accounts, isPending, isLinking: !!linkingType };
};
