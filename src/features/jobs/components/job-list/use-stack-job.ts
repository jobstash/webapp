'use client';

import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { jobListItemSchema, type JobListItemSchema } from '../../schemas';

const stackJobOptions = (id: string, importRunId: string | null) =>
  queryOptions({
    queryKey: ['job-stack-card', importRunId, id],
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `/api/jobs/cards/${encodeURIComponent(id)}`,
        {
          signal,
        },
      );
      if (!response.ok) throw new Error('Job unavailable');
      const job = jobListItemSchema.parse(await response.json());
      if (job.id !== id) throw new Error('Job lookup mismatch');
      return job;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });

export const useStackJob = (
  id: string,
  importRunId: string | null,
  initialJobs: JobListItemSchema[],
) => {
  const client = useQueryClient();
  const initial = initialJobs.find((job) => job.id === id);
  const query = useQuery({
    ...stackJobOptions(id, importRunId),
    initialData: initial,
    enabled: !initial,
  });
  return {
    job: initial ?? query.data,
    failed: query.isError,
    prefetch: (jobId: string) => {
      if (!initialJobs.some((job) => job.id === jobId))
        void client.prefetchQuery(stackJobOptions(jobId, importRunId));
    },
  };
};
