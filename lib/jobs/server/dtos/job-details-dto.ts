import * as v from 'valibot';

import { nonEmptyStringSchema, nullableStringSchema } from '@/lib/shared/core/schemas';

import { jobItemDto } from './job-item-dto';

export const jobDetailsDto = v.object({
  ...jobItemDto.entries,
  description: nullableStringSchema,
  requirements: v.nullable(v.array(nonEmptyStringSchema)),
  responsibilities: v.nullable(v.array(nonEmptyStringSchema)),
  benefits: v.nullable(v.array(nonEmptyStringSchema)),
  culture: v.nullable(v.array(nonEmptyStringSchema)),
});
export type JobDetailsDto = v.InferOutput<typeof jobDetailsDto>;
