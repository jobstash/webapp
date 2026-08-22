import 'server-only';

import { z } from 'zod';

import { nullableStringSchema } from '@/lib/schemas';
import { extendJobListItemDto } from './job-list-item.dto';

export const jobDetailsDto = extendJobListItemDto({
  description: nullableStringSchema,
  requirements: z.string().array().nullable(),
  responsibilities: z.string().array().nullable(),
  benefits: z.string().array().nullable(),
  culture: nullableStringSchema,
  hiringProcess: nullableStringSchema.optional(),
});
export type JobDetailsDto = z.infer<typeof jobDetailsDto>;
