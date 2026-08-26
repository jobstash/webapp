'use client';

import { usePrivy } from '@privy-io/react-auth';

import { useSession } from '@/features/auth/hooks/use-session';
import {
  COMPLETENESS_ITEMS,
  type CtaType,
  PROFILE_TIERS,
  type ProfileTier,
} from '@/features/profile/constants';
import { useProfileShowcase } from '@/features/profile/hooks/use-profile-showcase';
import { useProfileSkills } from '@/features/profile/hooks/use-profile-skills';

interface NextStep {
  key: string;
  label: string;
  action: string;
  unlocks: string;
  ctaType: CtaType;
}

interface ProfileCompleteness {
  isPending: boolean;
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

export const useProfileCompleteness = (): ProfileCompleteness => {
  const { isSessionReady } = useSession();
  const { user } = usePrivy();
  const { data: skills, isPending: isSkillsPending } =
    useProfileSkills(isSessionReady);
  const { data: showcase, isPending: isShowcasePending } =
    useProfileShowcase(isSessionReady);

  const isPending = !isSessionReady || isSkillsPending || isShowcasePending;

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

  return { isPending, tier, completedCount, nextStep };
};
