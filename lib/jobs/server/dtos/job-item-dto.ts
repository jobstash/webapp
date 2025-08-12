import 'server-only';

import * as z from 'zod';

import {
  fundingRoundDto,
  investorDto,
  orgInfoDto,
  projectAllInfoDto,
  tagDto,
} from '@/lib/shared/core/dtos';
import {
  nonEmptyStringSchema,
  nullableBooleanSchema,
  nullableNumberSchema,
  nullableStringSchema,
} from '@/lib/shared/core/schemas';

export const jobItemDto = z.object({
  id: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  url: nullableStringSchema,
  shortUUID: nonEmptyStringSchema,
  timestamp: z.number(),
  summary: nullableStringSchema,
  access: z.enum(['public', 'protected']),
  featured: z.boolean(),
  featureStartDate: nullableNumberSchema,
  featureEndDate: nullableNumberSchema,

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

  tags: z.array(tagDto),

  organization: z.nullable(
    z.object({
      ...orgInfoDto.shape,
      ...z.object({
        fundingRounds: z.array(fundingRoundDto),
        investors: z.array(investorDto),
        projects: z.array(projectAllInfoDto),
        aggregateRating: z.number().min(0).max(5),
        reviewCount: z.number(),
        hasUser: z.boolean(),
        atsClient: z.nullable(z.enum(['jobstash', 'greenhouse', 'lever', 'workable'])),
      }).shape,
    }),
  ),

  project: z.nullable(
    z.object({
      ...projectAllInfoDto.shape,
      hasUser: z.boolean(),
    }),
  ),

  onboardIntoWeb3: z.boolean(),
});
export type JobItemDto = z.infer<typeof jobItemDto>;
