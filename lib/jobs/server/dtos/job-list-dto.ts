import 'server-only';

import * as v from 'valibot';

import { ENV } from '@/lib/shared/core/envs';

import { jobItemDto } from './job-item-dto';

export const jobListPageDto = v.object({
  page: v.number(),
  count: v.number(),
  total: v.number(),
  data: v.array(jobItemDto),
});
export type JobListPageDto = v.InferOutput<typeof jobListPageDto>;

export const jobListPageParamsDto = v.object({
  page: v.pipe(v.number(), v.minValue(1)),
  limit: v.optional(v.pipe(v.number(), v.minValue(1)), ENV.PAGE_SIZE),
  searchParams: v.optional(v.record(v.string(), v.string())),
});
export type JobListPageParamsDto = v.InferOutput<typeof jobListPageParamsDto>;
