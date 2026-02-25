'use client';

import { useSession } from '@/features/auth/hooks/use-session';
import { useProfileShowcase } from '@/features/profile/hooks/use-profile-showcase';
import { useProfileSkills } from '@/features/profile/hooks/use-profile-skills';
import { useSuggestedJobs } from '@/features/profile/hooks/use-suggested-jobs';

export const useSuggestedJobsCard = () => {
  const { isSessionReady, isExpert } = useSession();
  const { data: profileSkills, isPending: isSkillsPending } =
    useProfileSkills(isSessionReady);
  const { data: showcase, isPending: isShowcasePending } =
    useProfileShowcase(isSessionReady);

  const hasResume = (showcase ?? []).some((item) => item.label === 'CV');
  const skills = profileSkills?.map((s) => s.normalizedName) ?? [];
  const hasSkills = skills.length > 0;
  const {
    jobs,
    isError,
    hasMore,
    fetchNextPage,
    isFetchingNextPage,
    isPending,
  } = useSuggestedJobs({
    enabled: isSessionReady,
    skills,
    isExpert,
  });

  return {
    jobs,
    isError,
    isPending,
    hasSkills,
    hasResume,
    isSkillsPending: isSkillsPending || isShowcasePending,
    hasMore,
    fetchNextPage,
    isFetchingNextPage,
  };
};
