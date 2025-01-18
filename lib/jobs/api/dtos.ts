import 'server-only';

import * as v from 'valibot';

import {
  fundingRoundDto,
  investorDto,
  orgInfoDto,
  projectAllInfoDto,
  tagDto,
} from '@/lib/shared/core/dtos';
import { PAGE_SIZE } from '@/lib/shared/core/envs';
import {
  nonEmptyStringSchema,
  nullableBooleanSchema,
  nullableNumberSchema,
  nullableStringSchema,
} from '@/lib/shared/core/schemas';

export const jobListItemDto = v.object({
  id: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  url: nullableStringSchema,
  shortUUID: nonEmptyStringSchema,
  timestamp: v.number(),
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
});
export type JobListItemDto = v.InferOutput<typeof jobListItemDto>;

export const jobListPageDto = v.object({
  page: v.number(),
  count: v.number(),
  total: v.number(),
  data: v.array(jobListItemDto),
});
export type JobListPageDto = v.InferOutput<typeof jobListPageDto>;

export const jobListPageParamsDto = v.object({
  page: v.pipe(v.number(), v.minValue(1)),
  limit: v.optional(v.pipe(v.number(), v.minValue(1)), PAGE_SIZE),
});
export type JobListPageParamsDto = v.InferOutput<typeof jobListPageParamsDto>;
