'use client';

import { useQuery } from '@tanstack/react-query';
import { usePrivy } from '@privy-io/react-auth';

import { useSession } from '@/features/auth/hooks/use-session';
import {
  COMPLETENESS_ITEMS,
  type CtaType,
  PROFILE_TIERS,
  type ProfileTier,
} from '@/features/profile/constants';
import { fetchProfileShowcase } from '@/features/profile/hooks/use-profile-showcase';
import { fetchProfileSkills } from '@/features/profile/hooks/use-profile-skills';

interface NextStep {
  key: string;
  label: string;
  action: string;
  unlocks: string;
  ctaType: CtaType;
}

interface ProfileCompleteness {
  isPending: boolean;
  isError: boolean;
  retry: () => void;
  isComplete: boolean;
  completionMap: Record<string, boolean>;
  tier: ProfileTier;
  completedCount: number;
  nextStep: NextStep | null;
}

const getTier = (completedCount: number): ProfileTier => {
  for (let i = PROFILE_TIERS.length - 1; i >= 0; i--) {
    if (completedCount >= PROFILE_TIERS[i].minItems) {
      return PROFILE_TIERS[i];
    }
  }
  return PROFILE_TIERS[0];
};

export const useProfileCompleteness = ({
  enabled = true,
  fresh = false,
} = {}): ProfileCompleteness => {
  const { isSessionReady } = useSession();
  const { user, ready } = usePrivy();
  const canLoad = enabled && isSessionReady && ready && Boolean(user);
  const queryOptions = {
    enabled: canLoad,
    staleTime: fresh ? 0 : 5 * 60 * 1000,
    refetchOnMount: fresh ? ('always' as const) : true,
    throwOnError: false,
  };
  // Scope completion checks to this identity; mutations invalidate the shared prefix.
  const skillsQuery = useQuery({
    ...queryOptions,
    queryKey: ['profile-skills', user?.id, 'completion'],
    queryFn: fetchProfileSkills,
  });
  const showcaseQuery = useQuery({
    ...queryOptions,
    queryKey: ['profile-showcase', user?.id, 'completion'],
    queryFn: fetchProfileShowcase,
  });
  const skills = skillsQuery.data;
  const showcase = showcaseQuery.data;
  const isError = skillsQuery.isError || showcaseQuery.isError;
  const isPending =
    !enabled ||
    !isSessionReady ||
    !ready ||
    !user ||
    skillsQuery.isPending ||
    showcaseQuery.isPending ||
    skillsQuery.isFetching ||
    showcaseQuery.isFetching;
  const retry = () => {
    void skillsQuery.refetch();
    void showcaseQuery.refetch();
  };

  // Count non-embedded linked accounts from Privy SDK
  const linkedAccountCount =
    user?.linkedAccounts.filter(
      (a) => !(a.type === 'wallet' && a.walletClientType === 'privy'),
    ).length ?? 0;

  const showcaseItems = showcase ?? [];
  const MANUAL_LINK_LABELS = new Set([
    'Linkedin',
    'Website',
    'Lens',
    'X',
    'Telegram',
    'Discord',
    'Phone',
  ]);
  const completionMap: Record<string, boolean> = {
    email:
      user?.linkedAccounts.some((account) => {
        if (account.type === 'email') return Boolean(account.address);
        if (
          account.type === 'google_oauth' ||
          account.type === 'apple_oauth' ||
          account.type === 'github_oauth'
        ) {
          return Boolean(account.email);
        }
        return false;
      }) ?? false,
    skills: (skills ?? []).length > 0,
    resume: showcaseItems.some((item) => item.label === 'CV'),
    'linked-accounts': linkedAccountCount > 0,
    'manual-links': showcaseItems.some((item) =>
      MANUAL_LINK_LABELS.has(item.label),
    ),
  };

  const completedCount = COMPLETENESS_ITEMS.filter(
    (item) => completionMap[item.key],
  ).length;

  const tier = getTier(completedCount);

  const nextStep =
    COMPLETENESS_ITEMS.find((item) => !completionMap[item.key]) ?? null;

  return {
    completionMap,
    isPending,
    isError,
    retry,
    isComplete:
      !isPending && !isError && completedCount === COMPLETENESS_ITEMS.length,
    tier,
    completedCount,
    nextStep,
  };
};
