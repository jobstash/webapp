import { z } from 'zod';

import { nonEmptyStringSchema } from '@/lib/schemas';
import {
  jobListItemSchema,
  jobOrganizationSchema,
} from '@/features/jobs/schemas';

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

export const pillarPageStaticSchema = z.object({
  title: nonEmptyStringSchema,
  description: nonEmptyStringSchema,
  jobs: jobListItemSchema.array(),
  // Org pillars: the same UI-optimized org shape jobs use, so the org
  // info card renders identically on pillar and job detail pages.
  organization: jobOrganizationSchema.nullable(),
  suggestedPillars: suggestedPillarSchema.array(),
});
export type PillarPageStatic = z.infer<typeof pillarPageStaticSchema>;

export const pillarFilterContextSchema = z.object({
  paramKey: nonEmptyStringSchema,
  value: nonEmptyStringSchema,
});
export type PillarFilterContext = z.infer<typeof pillarFilterContextSchema>;
