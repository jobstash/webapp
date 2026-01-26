import { z } from 'zod';

import { nonEmptyStringSchema } from '@/lib/schemas';
import { jobListItemSchema } from '@/features/jobs/schemas';

export const pillarDetailsSchema = z.object({
  title: nonEmptyStringSchema,
  description: nonEmptyStringSchema,
});
export type PillarDetails = z.infer<typeof pillarDetailsSchema>;

export const pillarPageStaticSchema = z.object({
  title: nonEmptyStringSchema,
  description: nonEmptyStringSchema,
  jobs: jobListItemSchema.array(),
});
export type PillarPageStatic = z.infer<typeof pillarPageStaticSchema>;

export const pillarFilterContextSchema = z.object({
  paramKey: z.string(),
  value: z.string(),
});
export type PillarFilterContext = z.infer<typeof pillarFilterContextSchema>;
