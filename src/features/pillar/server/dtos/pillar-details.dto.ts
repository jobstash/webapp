import 'server-only';

import { z } from 'zod';

import { nonEmptyStringSchema } from '@/lib/schemas';

export const pillarDetailsDto = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    title: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
  }),
});
export type PillarDetailsDto = z.infer<typeof pillarDetailsDto>;
