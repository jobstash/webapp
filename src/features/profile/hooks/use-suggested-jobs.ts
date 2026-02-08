'use client';

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { MAX_MATCH_SKILLS } from '@/lib/constants';
import { jobListItemSchema } from '@/features/jobs/schemas';

const responseSchema = z.object({
  page: z.number(),
  total: z.number(),
  data: jobListItemSchema.array(),
  hasMore: z.boolean(),
});

const STALE_TIME = 15 * 60 * 1000;
const ENDPOINT = '/api/profile/suggested-jobs';

const fetchSuggestedJobs = async (skills: string[], page: number) => {
  const params = new URLSearchParams({
    skills: skills.slice(0, MAX_MATCH_SKILLS).join(','),
    page: String(page),
  });

  const res = await fetch(`${ENDPOINT}?${params}`);
  if (!res.ok) throw new Error(`GET ${ENDPOINT} failed: ${res.status}`);

  const json: unknown = await res.json();
  return responseSchema.parse(json);
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
}: UseSuggestedJobsParams) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery({
      queryKey: ['profile-suggested-jobs', skills, isExpert],
      queryFn: ({ pageParam }) => fetchSuggestedJobs(skills, pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.page + 1 : undefined,
      enabled: enabled && skills.length > 0,
      staleTime: STALE_TIME,
      placeholderData: keepPreviousData,
    });

  const jobs = data?.pages.flatMap((p) => p.data) ?? [];

  return {
    jobs,
    hasMore: hasNextPage ?? false,
    fetchNextPage,
    isFetchingNextPage,
    isPending,
  };
};
