import 'server-only';

import { z } from 'zod';

import {
  nonEmptyStringSchema,
  nullableBooleanSchema,
  nullableNumberSchema,
  nullableStringSchema,
  optionalStringSchema,
} from '@/lib/schemas';
import { fundingRoundDto, investorDto, tagDto } from '@/lib/server/dtos';

export const jobListItemDto = z.object({
  id: nonEmptyStringSchema,
  title: nullableStringSchema,
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
      normalizedName: nonEmptyStringSchema,
      orgId: nonEmptyStringSchema,
      website: nullableStringSchema,
      // Tolerate missing/empty org copy — a required nonEmpty here would
      // drop the whole job (and fail entire pillar pages) on one bad org.
      summary: optionalStringSchema,
      location: nonEmptyStringSchema,
      description: optionalStringSchema,
      logoUrl: nullableStringSchema,
      headcountEstimate: nullableNumberSchema,
      fundingRounds: fundingRoundDto.array(),
      investors: investorDto.array(),
    })
    .nullable(),
});
export type JobListItemDto = z.infer<typeof jobListItemDto>;
