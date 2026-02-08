'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { MAX_MATCH_SKILLS } from '@/lib/constants';
import { similarJobSchema } from '@/features/jobs/schemas';

const responseSchema = z.object({ jobs: similarJobSchema.array() });

const STALE_TIME = 15 * 60 * 1000;
const ENDPOINT = '/api/profile/suggested-jobs';

const fetchSuggestedJobs = async (skills: string[]) => {
  const params = new URLSearchParams({
    skills: skills.slice(0, MAX_MATCH_SKILLS).join(','),
  });

  const res = await fetch(`${ENDPOINT}?${params}`);
  if (!res.ok) throw new Error(`GET ${ENDPOINT} failed: ${res.status}`);

  const json: unknown = await res.json();
  return responseSchema.parse(json).jobs;
};

interface UseSuggestedJobsParams {
  enabled: boolean;
  skills: string[];
  isExpert: boolean | null;
}

export const useSuggestedJobs = ({
  enabled,
  skills,
  isExpert,
}: UseSuggestedJobsParams) =>
  useQuery({
    queryKey: ['profile-suggested-jobs', skills, isExpert],
    queryFn: () => fetchSuggestedJobs(skills),
    enabled: enabled && skills.length > 0,
    staleTime: STALE_TIME,
    placeholderData: keepPreviousData,
  });
