import { z } from 'zod';

import { nonEmptyStringSchema, nullableStringSchema } from '@/lib/schemas';
import { jobListItemSchema } from '@/features/jobs/schemas';

export const pillarDetailsSchema = z.object({
  title: nonEmptyStringSchema,
  description: nonEmptyStringSchema,
});
export type PillarDetails = z.infer<typeof pillarDetailsSchema>;

export const suggestedPillarSchema = z.object({
  label: nonEmptyStringSchema,
  href: nonEmptyStringSchema,
});
export type SuggestedPillar = z.infer<typeof suggestedPillarSchema>;

export const pillarOrganizationSchema = z.object({
  name: nonEmptyStringSchema,
  summary: nullableStringSchema,
  description: nullableStringSchema,
});
export type PillarOrganization = z.infer<typeof pillarOrganizationSchema>;

export const pillarPageStaticSchema = z.object({
  title: nonEmptyStringSchema,
  description: nonEmptyStringSchema,
  jobs: jobListItemSchema.array(),
  organization: pillarOrganizationSchema.nullable(),
  suggestedPillars: suggestedPillarSchema.array(),
});
export type PillarPageStatic = z.infer<typeof pillarPageStaticSchema>;

export const pillarFilterContextSchema = z.object({
  paramKey: nonEmptyStringSchema,
  value: nonEmptyStringSchema,
});
export type PillarFilterContext = z.infer<typeof pillarFilterContextSchema>;
