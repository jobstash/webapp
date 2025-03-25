import 'server-only';

import * as v from 'valibot';

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

export const jobItemDto = v.object({
  id: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  url: nullableStringSchema,
  shortUUID: nonEmptyStringSchema,
  timestamp: v.number(),
  summary: nullableStringSchema,
  access: v.picklist(['public', 'protected']),
  featured: v.boolean(),
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

  tags: v.array(tagDto),

  organization: v.nullable(
    v.object({
      ...orgInfoDto.entries,
      ...v.object({
        fundingRounds: v.array(fundingRoundDto),
        investors: v.array(investorDto),
        projects: v.array(projectAllInfoDto),
        aggregateRating: v.pipe(v.number(), v.minValue(0), v.maxValue(5)),
        reviewCount: v.number(),
        hasUser: v.boolean(),
        atsClient: v.nullable(
          v.picklist(['jobstash', 'greenhouse', 'lever', 'workable']),
        ),
      }).entries,
    }),
  ),

  project: v.nullable(
    v.object({
      ...projectAllInfoDto.entries,
      hasUser: v.boolean(),
    }),
  ),

  onboardIntoWeb3: v.boolean(),
});
export type JobItemDto = v.InferOutput<typeof jobItemDto>;
