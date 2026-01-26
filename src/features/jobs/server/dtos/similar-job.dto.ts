import 'server-only';

import { z } from 'zod';

import {
  nonEmptyStringSchema,
  nullableNumberSchema,
  nullableStringSchema,
} from '@/lib/schemas';

export const similarJobDto = z.object({
  id: nonEmptyStringSchema,
  shortUUID: nonEmptyStringSchema,
  title: nullableStringSchema,
  minimumSalary: nullableNumberSchema,
  maximumSalary: nullableNumberSchema,
  salary: nullableNumberSchema,
  salaryCurrency: nullableStringSchema,
  location: nullableStringSchema,
  organization: z
    .object({
      name: nonEmptyStringSchema,
      logoUrl: nullableStringSchema,
      website: nullableStringSchema,
    })
    .nullable(),
});
export type SimilarJobDto = z.infer<typeof similarJobDto>;
