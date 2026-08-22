'use client';

import { useQuery } from '@tanstack/react-query';

import {
  jobsForMeResponseSchema,
  type JobsForMeResponse,
} from '../job-preferences';

const load = async (): Promise<JobsForMeResponse> => {
  const response = await fetch('/api/jobs/for-me', { cache: 'no-store' });
  if (!response.ok)
    throw new Error(`GET /api/jobs/for-me failed: ${response.status}`);
  return jobsForMeResponseSchema.parse(await response.json());
};

export const useJobsForMe = () =>
  useQuery({
    queryKey: ['jobs-for-me'],
    queryFn: load,
    staleTime: 60_000,
  });
