'use client';

import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { jobForMeSchema, type JobForMe } from '../job-preferences';

const load = async (): Promise<JobForMe[]> => {
  const response = await fetch('/api/jobs/for-me', { cache: 'no-store' });
  if (!response.ok)
    throw new Error(`GET /api/jobs/for-me failed: ${response.status}`);
  return z.array(jobForMeSchema).parse(await response.json());
};

export const useJobsForMe = () =>
  useQuery({
    queryKey: ['jobs-for-me'],
    queryFn: load,
    staleTime: 60_000,
  });
