import * as v from 'valibot';
import {
  mappedInfoTagSchema,
  nonEmptyStringSchema,
  nullableNumberSchema,
  nullableStringSchema,
  tagSchema,
} from '@/lib/shared/core/schemas';

const jobListItemProjectSchema = v.object({
  name: nonEmptyStringSchema,
  website: nullableStringSchema,
  logo: nullableStringSchema,
  chains: v.array(nonEmptyStringSchema), // Chain logos
  infoTags: v.array(mappedInfoTagSchema),
  tvlTags: v.array(mappedInfoTagSchema),
  auditTags: v.array(mappedInfoTagSchema),
});

export const jobListItemSchema = v.object({
  id: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  url: nullableStringSchema,
  shortUUID: nonEmptyStringSchema,
  timestamp: v.number(),
  access: v.picklist(['public', 'protected']),
  infoTags: v.array(mappedInfoTagSchema),
  tags: v.array(tagSchema),
  promotion: v.object({
    isFeatured: v.boolean(),
    endDate: nullableNumberSchema,
  }),
  organization: v.nullable(
    v.object({
      name: nonEmptyStringSchema,
      website: nullableStringSchema,
      logo: nullableStringSchema,
      projects: v.array(jobListItemProjectSchema),
      funding: v.object({
        date: nullableStringSchema,
        lastAmount: nullableStringSchema,
      }),
    }),
  ),
  project: v.nullable(jobListItemProjectSchema),
});

export type JobListItemSchema = v.InferOutput<typeof jobListItemSchema>;

export const jobListPageSchema = v.object({
  page: v.number(),
  total: v.number(),
  data: v.array(jobListItemSchema),
});
export type JobListPageSchema = v.InferOutput<typeof jobListPageSchema>;
