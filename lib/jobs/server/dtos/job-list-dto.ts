import 'server-only';

import * as z from 'zod';

import { CLIENT_ENVS } from '@/lib/shared/core/client.env';

import { jobItemDto } from './job-item-dto';

export const jobListPageDto = z.object({
  page: z.number(),
  count: z.number(),
  total: z.number(),
  data: z.array(jobItemDto),
});
export type JobListPageDto = z.infer<typeof jobListPageDto>;

export const jobListPageParamsDto = z.object({
  page: z.number().min(1),
  limit: z.number().min(1).optional().default(CLIENT_ENVS.PAGE_SIZE),
  searchParams: z.record(z.string(), z.string()).optional(),
});
export type JobListPageParamsDto = z.infer<typeof jobListPageParamsDto>;
