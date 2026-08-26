'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  recommendedJobsResponseSchema,
  type RecommendedJobsResponse,
} from '../recommended-jobs';

const QUERY_KEY = ['recommended-jobs'] as const;

const load = async (): Promise<RecommendedJobsResponse> => {
  const response = await fetch('/api/jobs/recommended', {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`GET /api/jobs/recommended failed: ${response.status}`);
  }
  return recommendedJobsResponseSchema.parse(await response.json());
};

const recordActivity = async (body: {
  shortUUID: string;
  eventType: 'job_impression' | 'job_dismiss';
  eventId: string;
  surface: 'jobs_for_me';
  position?: number;
}) => {
  const response = await fetch('/api/jobs/activity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  });
  if (!response.ok && response.status !== 204) {
    throw new Error(`POST /api/jobs/activity failed: ${response.status}`);
  }
};

export const useRecommendedJobs = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: load,
    staleTime: 60_000,
  });

export const useDismissRecommendedJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (shortUUID: string) =>
      recordActivity({
        shortUUID,
        eventType: 'job_dismiss',
        eventId: crypto.randomUUID(),
        surface: 'jobs_for_me',
      }),
    onSuccess: (_, shortUUID) => {
      queryClient.setQueryData<RecommendedJobsResponse>(
        QUERY_KEY,
        (current) => {
          if (!current) return current;
          const jobs = current.jobs.filter(({ job }) => job.id !== shortUUID);
          return { jobs, total: jobs.length };
        },
      );
    },
  });
};

export const recordRecommendedJobImpression = (
  shortUUID: string,
  position: number,
) =>
  recordActivity({
    shortUUID,
    eventType: 'job_impression',
    eventId: crypto.randomUUID(),
    surface: 'jobs_for_me',
    position,
  });
