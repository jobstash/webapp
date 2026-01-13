import { z } from 'zod';

import {
  mappedInfoTagSchema,
  nonEmptyStringSchema,
  nullableStringSchema,
} from '@/lib/schemas';
import { JOB_ITEM_BADGE } from '@/features/jobs/constants';

export const jobTagSchema = z.object({
  id: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
  normalizedName: nonEmptyStringSchema,
  colorIndex: z.number().min(1).max(12),
});
export type JobTagSchema = z.infer<typeof jobTagSchema>;

export const jobListItemSchema = z.object({
  id: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  href: nonEmptyStringSchema,
  applyUrl: nullableStringSchema,
  summary: nullableStringSchema,
  infoTags: mappedInfoTagSchema.array(),
  tags: jobTagSchema.array(),
  organization: z.nullable(
    z.object({
      name: nonEmptyStringSchema,
      url: nullableStringSchema,
      location: nullableStringSchema,
      logo: nullableStringSchema,
      infoTags: mappedInfoTagSchema.array(),
    }),
  ),
  timestampText: nonEmptyStringSchema,
  badge: z.nullable(
    z.enum(Object.values(JOB_ITEM_BADGE) as [string, ...string[]]),
  ),
});
export type JobListItemSchema = z.infer<typeof jobListItemSchema>;

export const jobListPageSchema = z.object({
  page: z.number(),
  total: z.number(),
  data: jobListItemSchema.array(),
});
export type JobListPageSchema = z.infer<typeof jobListPageSchema>;
