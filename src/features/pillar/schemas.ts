import { z } from 'zod';

import { nonEmptyStringSchema } from '@/lib/schemas';

export const pillarDetailsSchema = z.object({
  title: nonEmptyStringSchema,
  description: nonEmptyStringSchema,
});
export type PillarDetails = z.infer<typeof pillarDetailsSchema>;
