'use client';

import { useSession } from '@/features/auth/hooks/use-session';
import { COMPLETENESS_WEIGHTS } from '@/features/profile/constants';
import { useProfileShowcase } from '@/features/profile/hooks/use-profile-showcase';
import { useProfileSkills } from '@/features/profile/hooks/use-profile-skills';

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

export const useProfileCompleteness = (): ProfileCompleteness => {
  const { isSessionReady, isExpert } = useSession();
  const { data: skills } = useProfileSkills(isSessionReady);
  const { data: showcase } = useProfileShowcase(isSessionReady);

  const showcaseItems = showcase ?? [];
  const hasSkills = (skills ?? []).length > 0;
  const hasResume = showcaseItems.some((item) => item.label === 'CV');
  const hasEmail = showcaseItems.some((item) => item.label === 'Email');
  const hasSocial = showcaseItems.some(
    (item) => item.label !== 'CV' && item.label !== 'Email',
  );

  const items: CompletenessItem[] = [
    {
      label: 'Add skills',
      isComplete: hasSkills,
      weight: COMPLETENESS_WEIGHTS.hasSkills,
      href: '/profile',
    },
    {
      label: 'Upload resume',
      isComplete: hasResume,
      weight: COMPLETENESS_WEIGHTS.hasResume,
      href: '/profile',
    },
    {
      label: 'Connect socials',
      isComplete: hasSocial,
      weight: COMPLETENESS_WEIGHTS.hasSocial,
      href: '/profile',
    },
    {
      label: 'Add email',
      isComplete: hasEmail,
      weight: COMPLETENESS_WEIGHTS.hasEmail,
      href: '/profile',
    },
    {
      label: 'Become an expert',
      isComplete: isExpert === true,
      weight: COMPLETENESS_WEIGHTS.isExpert,
      href: '/b-expert',
    },
  ];

  const percentage = items
    .filter((item) => item.isComplete)
    .reduce((sum, item) => sum + item.weight, 0);

  return { percentage, items };
};
