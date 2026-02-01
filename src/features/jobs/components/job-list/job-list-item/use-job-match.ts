'use client';

import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { MAX_MATCH_SKILLS } from '@/lib/constants';
import { nonEmptyStringSchema } from '@/lib/schemas';
import { useEligibility } from '@/hooks/use-eligibility';
import { useProfileSkills } from '@/features/profile/hooks/use-profile-skills';

const jobMatchSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    score: z.number(),
    category: nonEmptyStringSchema,
  }),
});

type JobMatch = z.infer<typeof jobMatchSchema>['data'];

const fetchJobMatch = async (
  jobId: string,
  skills: string[],
): Promise<JobMatch> => {
  const url = new URL(`/api/jobs/match/${jobId}`, window.location.origin);
  url.searchParams.set('skills', skills.join(','));

  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET /api/jobs/match failed: ${res.status}`);

  const json: unknown = await res.json();
  return jobMatchSchema.parse(json).data;
};

export const useJobMatch = (jobId: string) => {
  const {
    isAuthenticated,
    isExpert,
    isLoading: isAuthLoading,
  } = useEligibility();
  const { data: skills, isPending: isSkillsPending } =
    useProfileSkills(isAuthenticated);

  const sortedSkills = (skills ?? [])
    .map((s) => s.normalizedName)
    .sort()
    .slice(0, MAX_MATCH_SKILLS);

  const hasSkills = sortedSkills.length > 0;

  const { data: match, isPending: isMatchPending } = useQuery({
    queryKey: ['job-match', jobId, sortedSkills, isExpert],
    queryFn: () => fetchJobMatch(jobId, sortedSkills),
    enabled: isAuthenticated && hasSkills,
    staleTime: 15 * 60 * 1000,
  });

  const isLoading =
    isAuthLoading ||
    (isAuthenticated && isSkillsPending) ||
    (isAuthenticated && hasSkills && isMatchPending);

  return {
    isAuthenticated,
    isLoading,
    match: match ?? null,
  };
};
