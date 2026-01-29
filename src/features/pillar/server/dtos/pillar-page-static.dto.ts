import 'server-only';

import { z } from 'zod';

import { nonEmptyStringSchema } from '@/lib/schemas';
import { jobListItemDto } from '@/features/jobs/server/dtos/job-list-item.dto';

export const pillarPageStaticDto = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    title: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
    jobs: jobListItemDto.array(),
    suggestedPillars: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .optional()
      .default([]),
  }),
});
export type PillarPageStaticDto = z.infer<typeof pillarPageStaticDto>;
