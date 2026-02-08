'use client';

import { useSession } from '@/features/auth/hooks/use-session';
import { useProfileSkills } from '@/features/profile/hooks/use-profile-skills';
import { useSuggestedJobs } from '@/features/profile/hooks/use-suggested-jobs';

export const useSuggestedJobsCard = () => {
  const { isSessionReady, isExpert } = useSession();
  const { data: profileSkills, isPending: isSkillsPending } =
    useProfileSkills(isSessionReady);

  const skills = profileSkills?.map((s) => s.normalizedName) ?? [];
  const hasSkills = skills.length > 0;
  const { data: jobs = [], isPending } = useSuggestedJobs({
    enabled: isSessionReady,
    skills,
    isExpert,
  });

  return {
    jobs,
    isPending,
    hasSkills,
    isSkillsPending,
  };
};
