import * as z from 'zod';

import {
  infiniteListPageSchema,
  mappedInfoTagSchema,
  nonEmptyStringSchema,
  nullableNumberSchema,
  nullableStringSchema,
} from '@/lib/shared/core/schemas';
import { JOB_ITEM_BADGE } from '@/lib/jobs/core/constants';

export const jobTagSchema = z.object({
  id: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
  normalizedName: nonEmptyStringSchema,
  colorIndex: z.number().min(1).max(12),
});
export type JobTagSchema = z.infer<typeof jobTagSchema>;

export const jobItemProjectSchema = z.object({
  name: nonEmptyStringSchema,
  website: nullableStringSchema,
  logo: nullableStringSchema,
  chains: z.array(nonEmptyStringSchema),
  infoTags: z.array(mappedInfoTagSchema),
});
export type JobItemProjectSchema = z.infer<typeof jobItemProjectSchema>;

export const jobItemSchema = z.object({
  id: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  href: nonEmptyStringSchema,
  applyUrl: nullableStringSchema,
  access: z.enum(['public', 'protected']),
  summary: nullableStringSchema,
  infoTags: z.array(mappedInfoTagSchema),
  tags: z.array(jobTagSchema),
  organization: z.nullable(
    z.object({
      name: nonEmptyStringSchema,
      href: nonEmptyStringSchema,
      location: nullableStringSchema,
      logo: nullableStringSchema,
      infoTags: z.array(mappedInfoTagSchema),
    }),
  ),
  projects: z.array(jobItemProjectSchema),
  promotionEndDate: nullableNumberSchema,
  hasGradientBorder: z.boolean(),
  badge: z.nullable(z.enum(Object.values(JOB_ITEM_BADGE) as [string, ...string[]])),
  isUrgentlyHiring: z.boolean(),
  timestampText: nonEmptyStringSchema,
});
export type JobItemSchema = z.infer<typeof jobItemSchema>;

export const jobListPageSchema = infiniteListPageSchema(jobItemSchema);
export type JobListPageSchema = z.infer<typeof jobListPageSchema>;

export const jobDetailsSchema = z.object({
  ...jobItemSchema.shape,
  description: nullableStringSchema,
  requirements: z.nullable(z.array(nonEmptyStringSchema)),
  responsibilities: z.nullable(z.array(nonEmptyStringSchema)),
  benefits: z.nullable(z.array(nonEmptyStringSchema)),
  culture: z.nullable(z.array(nonEmptyStringSchema)),
});
export type JobDetailsSchema = z.infer<typeof jobDetailsSchema>;
