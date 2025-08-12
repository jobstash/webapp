import * as z from 'zod';

import { nonEmptyStringSchema, nullableStringSchema } from '@/lib/shared/core/schemas';

import { jobItemDto } from './job-item-dto';

export const jobDetailsDto = z.object({
  ...jobItemDto.shape,
  description: nullableStringSchema,
  requirements: z.nullable(z.array(nonEmptyStringSchema)),
  responsibilities: z.nullable(z.array(nonEmptyStringSchema)),
  benefits: z.nullable(z.array(nonEmptyStringSchema)),
  culture: z.nullable(z.array(nonEmptyStringSchema)),
});
export type JobDetailsDto = z.infer<typeof jobDetailsDto>;
