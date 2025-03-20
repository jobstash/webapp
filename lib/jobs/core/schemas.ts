import * as v from 'valibot';

import {
  infiniteListPageSchema,
  mappedInfoTagSchema,
  nonEmptyStringSchema,
  nullableNumberSchema,
  nullableStringSchema,
} from '@/lib/shared/core/schemas';

export const jobTagSchema = v.object({
  name: nonEmptyStringSchema,
  normalizedName: nonEmptyStringSchema,
  colorIndex: v.pipe(v.number(), v.minValue(1), v.maxValue(12)),
});
export type JobTagSchema = v.InferOutput<typeof jobTagSchema>;

export const jobListItemProjectSchema = v.object({
  name: nonEmptyStringSchema,
  website: nullableStringSchema,
  logo: nullableStringSchema,
  chains: v.array(nonEmptyStringSchema),
  infoTags: v.array(mappedInfoTagSchema),
});
export type JobListItemProjectSchema = v.InferOutput<typeof jobListItemProjectSchema>;

export const jobListItemSchema = v.object({
  id: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  url: nullableStringSchema,
  timestamp: v.number(),
  access: v.picklist(['public', 'protected']),
  infoTags: v.array(mappedInfoTagSchema),
  tags: v.array(jobTagSchema),
  promotion: v.object({
    isFeatured: v.boolean(),
    endDate: nullableNumberSchema,
  }),
  organization: v.nullable(
    v.object({
      name: nonEmptyStringSchema,
      website: nullableStringSchema,
      location: nullableStringSchema,
      logo: nullableStringSchema,
      infoTags: v.array(mappedInfoTagSchema),
    }),
  ),
  projects: v.array(jobListItemProjectSchema),
});

export type JobListItemSchema = v.InferOutput<typeof jobListItemSchema>;

export const jobListPageSchema = infiniteListPageSchema(jobListItemSchema);
export type JobListPageSchema = v.InferOutput<typeof jobListPageSchema>;
