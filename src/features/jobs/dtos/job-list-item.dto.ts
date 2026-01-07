import { z } from 'zod';

import {
  nonEmptyStringSchema,
  nullableBooleanSchema,
  nullableNumberSchema,
  nullableStringSchema,
} from '@/lib/schemas';
import { fundingRoundDto, tagDto } from '@/lib/server/dtos';

export const jobListItemDto = z.object({
  id: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  url: nullableStringSchema,
  shortUUID: nonEmptyStringSchema,
  timestamp: z.number(),
  summary: nullableStringSchema,

  seniority: nullableStringSchema,
  salary: nullableNumberSchema,
  minimumSalary: nullableNumberSchema,
  maximumSalary: nullableNumberSchema,
  location: nullableStringSchema,
  locationType: nullableStringSchema,
  commitment: nullableStringSchema,
  paysInCrypto: nullableBooleanSchema,
  offersTokenAllocation: nullableBooleanSchema,
  salaryCurrency: nullableStringSchema,
  classification: nullableStringSchema,
  tags: tagDto.array(),

  access: z.enum(['public', 'protected']),
  featured: z.boolean(),
  featureStartDate: nullableNumberSchema,
  featureEndDate: nullableNumberSchema,
  onboardIntoWeb3: z.boolean(),

  organization: z
    .object({
      id: nonEmptyStringSchema,
      name: nonEmptyStringSchema,
      orgId: nonEmptyStringSchema,
      website: nullableStringSchema,
      summary: nonEmptyStringSchema,
      location: nonEmptyStringSchema,
      description: nonEmptyStringSchema,
      logoUrl: nullableStringSchema,
      headcountEstimate: nullableNumberSchema,
      fundingRounds: fundingRoundDto.array(),
    })
    .nullable(),
});
export type JobListItemDto = z.infer<typeof jobListItemDto>;
