'use client';

import { useSession } from '@/features/auth/hooks/use-session';
import {
  COMPLETENESS_ITEMS,
  PROFILE_TIERS,
  type ProfileTier,
} from '@/features/profile/constants';
import { useProfileShowcase } from '@/features/profile/hooks/use-profile-showcase';
import { useProfileSkills } from '@/features/profile/hooks/use-profile-skills';

interface NextStep {
  label: string;
  action: string;
  unlocks: string;
  href: string;
}

interface ProfileCompleteness {
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
  const { data: skills } = useProfileSkills(isSessionReady);
  const { data: showcase } = useProfileShowcase(isSessionReady);

  const showcaseItems = showcase ?? [];
  const completionMap: Record<string, boolean> = {
    skills: (skills ?? []).length > 0,
    resume: showcaseItems.some((item) => item.label === 'CV'),
    social: showcaseItems.some(
      (item) => item.label !== 'CV' && item.label !== 'Email',
    ),
    email: showcaseItems.some((item) => item.label === 'Email'),
  };

  const completedCount = COMPLETENESS_ITEMS.filter(
    (item) => completionMap[item.key],
  ).length;

  const tier = getTier(completedCount);

  const nextStep =
    COMPLETENESS_ITEMS.find((item) => !completionMap[item.key]) ?? null;

  return { tier, completedCount, nextStep };
};
