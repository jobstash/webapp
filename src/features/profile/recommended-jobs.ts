import { z } from 'zod';

import { jobListItemSchema } from '@/features/jobs/schemas';

export const recommendedJobSchema = z.object({
  job: jobListItemSchema,
  reason: z.string().min(1),
});

export const recommendedJobsResponseSchema = z.object({
  rankingVersion: z.string().default('legacy'),
  jobs: z.array(recommendedJobSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive().default(1),
  hasMore: z.boolean().default(false),
});

export type RecommendedJob = z.infer<typeof recommendedJobSchema>;
export type RecommendedJobsResponse = z.infer<
  typeof recommendedJobsResponseSchema
>;
