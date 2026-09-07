import { z } from 'zod';

import { jobListItemSchema } from '@/features/jobs/schemas';

export const recommendedJobSchema = z.object({
  job: jobListItemSchema,
});

export const recommendedJobsResponseSchema = z.object({
  rankingVersion: z.string().default('legacy'),
  jobs: z.array(recommendedJobSchema),
  total: z.number().int().nonnegative(),
});

export type RecommendedJob = z.infer<typeof recommendedJobSchema>;
export type RecommendedJobsResponse = z.infer<
  typeof recommendedJobsResponseSchema
>;
