'use client';

import { useSession } from '@/features/auth/hooks/use-session';
import { useProfileSkills } from '@/features/profile/hooks/use-profile-skills';
import { useSuggestedJobs } from '@/features/profile/hooks/use-suggested-jobs';

export const useSuggestedJobsCard = () => {
  const { isSessionReady, isExpert } = useSession();
  const { data: profileSkills } = useProfileSkills(isSessionReady);

  const skills = profileSkills?.map((s) => s.normalizedName) ?? [];
  const { data: jobs = [], isPending } = useSuggestedJobs({ skills, isExpert });

  const isEmpty = !isPending && jobs.length === 0;

  return { jobs, isPending, isEmpty };
};
