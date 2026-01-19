import 'server-only';

import { z } from 'zod';

import { nullableStringSchema } from '@/lib/schemas';
import { jobListItemDto } from './job-list-item.dto';

export const jobDetailsDto = jobListItemDto.extend({
  description: nullableStringSchema,
  requirements: z.string().array(),
  responsibilities: z.string().array(),
  benefits: z.string().array(),
});
export type JobDetailsDto = z.infer<typeof jobDetailsDto>;
