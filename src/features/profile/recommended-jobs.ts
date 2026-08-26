import { z } from 'zod';

import { jobListItemSchema } from '@/features/jobs/schemas';

export const recommendedJobSchema = z.object({
  job: jobListItemSchema,
  reason: z.string().min(1),
});

export const recommendedJobsResponseSchema = z.object({
  jobs: z.array(recommendedJobSchema),
  total: z.number().int().nonnegative(),
});

export type RecommendedJob = z.infer<typeof recommendedJobSchema>;
export type RecommendedJobsResponse = z.infer<
  typeof recommendedJobsResponseSchema
>;
