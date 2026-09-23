import 'server-only';
import { z } from 'zod';
import { clientEnv } from '@/lib/env/client';
import { jobListItemDto } from '../dtos/job-list-item.dto';
import { dtoToJobListItem } from '../dtos/dto-to-job-list-item';

const paging = {
  page: z.number(),
  count: z.number(),
  total: z.number(),
  totalJobs: z.number(),
};
export const jobFeedDto = z.discriminatedUnion('mode', [
  z.object({
    ...paging,
    mode: z.literal('individual'),
    data: jobListItemDto.array(),
  }),
  z.object({
    ...paging,
    mode: z.literal('grouped'),
    data: z.array(
      z.object({
        key: z.string(),
        organizationId: z.string().nullable(),
        totalJobs: z.number(),
        jobs: jobListItemDto.array().min(1).max(5),
      }),
    ),
  }),
]);

export const fetchJobFeed = async (
  page: number,
  searchParams: Record<string, string>,
) => {
  const params = new URLSearchParams({
    ...searchParams,
    page: String(page),
    limit: '10',
  });
  const response = await fetch(`${clientEnv.MW_URL}/jobs/feed?${params}`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Job feed failed: ${response.status}`);
  const result = jobFeedDto.parse(await response.json());
  if (result.mode === 'individual')
    return { ...result, data: result.data.map(dtoToJobListItem) };
  return {
    ...result,
    data: result.data.map((entry) => ({
      ...entry,
      jobs: entry.jobs.map(dtoToJobListItem),
    })),
  };
};
