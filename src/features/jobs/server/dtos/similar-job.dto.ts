import 'server-only';

import { z } from 'zod';

import { nonEmptyStringSchema, nullableStringSchema } from '@/lib/schemas';

export const similarJobItemDto = z.object({
  shortUUID: nonEmptyStringSchema,
  title: nullableStringSchema,
  timestamp: z.number(),
  organization: z
    .object({
      name: nonEmptyStringSchema,
      logoUrl: nullableStringSchema,
      website: nullableStringSchema,
      normalizedName: nullableStringSchema,
    })
    .nullable(),
});
export type SimilarJobItemDto = z.infer<typeof similarJobItemDto>;

export const similarJobDto = z.object({
  success: z.boolean(),
  message: z.string(),
  data: similarJobItemDto.array().default([]),
});
