'use client';

import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { nonEmptyStringSchema, nullableStringSchema } from '@/lib/schemas';

const matchedJobSchema = z.object({
  shortUuid: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  orgName: nullableStringSchema,
  orgLogo: nullableStringSchema,
  match: z.object({
    score: z.number(),
    category: nonEmptyStringSchema,
  }),
});
export type MatchedJob = z.infer<typeof matchedJobSchema>;

const matchedJobsResponseSchema = z.object({
  jobs: matchedJobSchema.array(),
});

const fetchMatchedJobs = async (): Promise<MatchedJob[]> => {
  const res = await fetch('/api/profile/matched-jobs');
  if (!res.ok)
    throw new Error(`GET /api/profile/matched-jobs failed: ${res.status}`);

  const json: unknown = await res.json();
  return matchedJobsResponseSchema.parse(json).jobs;
};

export const useJobsForYou = (enabled: boolean) =>
  useQuery({
    queryKey: ['profile-matched-jobs'],
    queryFn: fetchMatchedJobs,
    enabled,
    staleTime: 15 * 60 * 1000,
  });
