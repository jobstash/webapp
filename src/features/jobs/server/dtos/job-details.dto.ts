import 'server-only';

import { z } from 'zod';

import { nullableStringSchema } from '@/lib/schemas';
import { jobListItemDto } from './job-list-item.dto';

export const jobDetailsDto = jobListItemDto.extend({
  description: nullableStringSchema,
  requirements: z.string().array().nullable(),
  responsibilities: z.string().array().nullable(),
  benefits: z.string().array().nullable(),
  culture: nullableStringSchema,
});
export type JobDetailsDto = z.infer<typeof jobDetailsDto>;
