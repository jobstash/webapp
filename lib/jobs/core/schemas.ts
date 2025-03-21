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
  url: nullableStringSchema,
  timestampText: nonEmptyStringSchema,
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
  projects: v.array(jobItemProjectSchema),
});

export type JobItemSchema = v.InferOutput<typeof jobItemSchema>;

export const jobListPageSchema = infiniteListPageSchema(jobItemSchema);
export type JobListPageSchema = v.InferOutput<typeof jobListPageSchema>;
