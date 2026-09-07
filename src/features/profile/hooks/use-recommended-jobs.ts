'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  recommendedJobsResponseSchema,
  type RecommendedJobsResponse,
} from '../recommended-jobs';

const QUERY_KEY = ['recommended-jobs'] as const;

const load = async (
  page: number,
  rankedAt?: string,
): Promise<RecommendedJobsResponse> => {
  const query = new URLSearchParams({ page: String(page) });
  if (rankedAt) query.set('rankedAt', rankedAt);
  const response = await fetch(`/api/jobs/recommended?${query}`, {
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
  metadata?: Record<string, unknown>;
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

export const useRecommendedJobs = (page = 1, rankedAt?: string) =>
  useQuery({
    queryKey: rankedAt ? [...QUERY_KEY, page, rankedAt] : [...QUERY_KEY, page],
    queryFn: () => load(page, rankedAt),
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
      queryClient.setQueriesData<RecommendedJobsResponse>(
        { queryKey: QUERY_KEY },
        (current) => {
          if (!current) return current;
          const jobs = current.jobs.filter(({ job }) => job.id !== shortUUID);
          return { ...current, jobs, total: Math.max(0, current.total - 1) };
        },
      );
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const recordRecommendedJobImpression = (
  shortUUID: string,
  position: number,
  rankingVersion = 'legacy',
) =>
  recordActivity({
    shortUUID,
    eventType: 'job_impression',
    eventId: crypto.randomUUID(),
    surface: 'jobs_for_me',
    position,
    metadata: { rankingVersion },
  });
