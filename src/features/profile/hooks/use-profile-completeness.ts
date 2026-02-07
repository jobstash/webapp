'use client';

import { useSession } from '@/features/auth/hooks/use-session';
import { COMPLETENESS_WEIGHTS } from '@/features/profile/constants';
import { useProfileShowcase } from '@/features/profile/hooks/use-profile-showcase';
import { useProfileSkills } from '@/features/profile/hooks/use-profile-skills';
import type { ProfileSkill, ShowcaseItem } from '@/features/profile/schemas';

interface CompletenessItem {
  label: string;
  isComplete: boolean;
  weight: number;
  href: string;
}

interface ProfileCompleteness {
  percentage: number;
  items: CompletenessItem[];
}

export const calculateCompleteness = (
  skills: ProfileSkill[],
  showcase: ShowcaseItem[],
): ProfileCompleteness => {
  const showcaseLabels = new Set(showcase.map((item) => item.label));

  const items: CompletenessItem[] = [
    {
      label: 'Add skills',
      isComplete: skills.length > 0,
      weight: COMPLETENESS_WEIGHTS.hasSkills,
      href: '/profile',
    },
    {
      label: 'Upload resume',
      isComplete: showcaseLabels.has('CV'),
      weight: COMPLETENESS_WEIGHTS.hasResume,
      href: '/profile',
    },
    {
      label: 'Connect socials',
      isComplete: showcase.some(
        (item) => item.label !== 'CV' && item.label !== 'Email',
      ),
      weight: COMPLETENESS_WEIGHTS.hasSocial,
      href: '/profile',
    },
    {
      label: 'Add email',
      isComplete: showcaseLabels.has('Email'),
      weight: COMPLETENESS_WEIGHTS.hasEmail,
      href: '/profile',
    },
  ];

  const percentage = items
    .filter((item) => item.isComplete)
    .reduce((sum, item) => sum + item.weight, 0);

  return { percentage, items };
};

export const useProfileCompleteness = (): ProfileCompleteness => {
  const { isSessionReady } = useSession();
  const { data: skills } = useProfileSkills(isSessionReady);
  const { data: showcase } = useProfileShowcase(isSessionReady);

  return calculateCompleteness(skills ?? [], showcase ?? []);
};
