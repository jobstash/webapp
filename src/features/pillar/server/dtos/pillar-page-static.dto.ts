import 'server-only';

import { z } from 'zod';

import { nonEmptyStringSchema, optionalStringSchema } from '@/lib/schemas';
import { jobListItemDto } from '@/features/jobs/server/dtos/job-list-item.dto';

// Emitted by newer MW versions for o-* pillars; lets zero-job org pillars
// still show real org content.
const pillarOrganizationDto = z.object({
  name: nonEmptyStringSchema,
  summary: optionalStringSchema,
  description: optionalStringSchema,
});

export const pillarPageStaticDto = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    title: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
    jobs: jobListItemDto.array(),
    organization: pillarOrganizationDto.nullish(),
    suggestedPillars: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .optional()
      .default([]),
  }),
});
export type PillarPageStaticDto = z.infer<typeof pillarPageStaticDto>;
