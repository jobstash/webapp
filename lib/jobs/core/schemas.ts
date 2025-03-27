import * as v from 'valibot';

import {
  infiniteListPageSchema,
  mappedInfoTagSchema,
  nonEmptyStringSchema,
  nullableNumberSchema,
  nullableStringSchema,
} from '@/lib/shared/core/schemas';
import { jobBadgeLabels } from '@/lib/jobs/core/constants';

export const jobTagSchema = v.object({
  id: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
  normalizedName: nonEmptyStringSchema,
  colorIndex: v.pipe(v.number(), v.minValue(1), v.maxValue(12)),
});
export type JobTagSchema = v.InferOutput<typeof jobTagSchema>;

export const jobItemProjectSchema = v.object({
  name: nonEmptyStringSchema,
  website: nullableStringSchema,
  logo: nullableStringSchema,
  chains: v.array(nonEmptyStringSchema),
  infoTags: v.array(mappedInfoTagSchema),
});
export type JobItemProjectSchema = v.InferOutput<typeof jobItemProjectSchema>;

export const jobItemSchema = v.object({
  id: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  href: nonEmptyStringSchema,
  applyUrl: nullableStringSchema,
  access: v.picklist(['public', 'protected']),
  summary: nullableStringSchema,
  infoTags: v.array(mappedInfoTagSchema),
  tags: v.array(jobTagSchema),
  organization: v.nullable(
    v.object({
      name: nonEmptyStringSchema,
      href: nonEmptyStringSchema,
      location: nullableStringSchema,
      logo: nullableStringSchema,
      infoTags: v.array(mappedInfoTagSchema),
    }),
  ),
  projects: v.array(jobItemProjectSchema),
  promotionEndDate: nullableNumberSchema,
  hasGradientBorder: v.boolean(),
  badge: v.nullable(v.picklist(Object.values(jobBadgeLabels))),
  isUrgentlyHiring: v.boolean(),
  timestampText: nonEmptyStringSchema,
});
export type JobItemSchema = v.InferOutput<typeof jobItemSchema>;

export const jobListPageSchema = infiniteListPageSchema(jobItemSchema);
export type JobListPageSchema = v.InferOutput<typeof jobListPageSchema>;

export const jobDetailsSchema = v.object({
  ...jobItemSchema.entries,
  description: nullableStringSchema,
  requirements: v.nullable(v.array(nonEmptyStringSchema)),
  responsibilities: v.nullable(v.array(nonEmptyStringSchema)),
  benefits: v.nullable(v.array(nonEmptyStringSchema)),
  culture: v.nullable(v.array(nonEmptyStringSchema)),
});
export type JobDetailsSchema = v.InferOutput<typeof jobDetailsSchema>;
