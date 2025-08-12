import 'server-only';

import * as z from 'zod';

import { nonEmptyStringSchema } from '@/lib/shared/core/schemas';

export const filterConfigSharedPropertiesDto = z.object({
  position: z.number(),
  label: nonEmptyStringSchema,
  show: z.boolean(),
  googleAnalyticsEventId: z.nullish(nonEmptyStringSchema),
  googleAnalyticsEventName: z.nullish(nonEmptyStringSchema),
});
export type FilterConfigSharedPropertiesDto = z.infer<
  typeof filterConfigSharedPropertiesDto
>;

const rangeFilterConfigValueDto = z.object({
  value: z.number().min(0),
  paramKey: nonEmptyStringSchema,
});
export type RangeFilterConfigValueDto = z.infer<typeof rangeFilterConfigValueDto>;

export const rangeFilterConfigDto = z.object({
  ...filterConfigSharedPropertiesDto.shape,
  kind: z.literal('RANGE'),
  value: z.object({
    lowest: rangeFilterConfigValueDto,
    highest: rangeFilterConfigValueDto,
  }),
  prefix: z.nullish(nonEmptyStringSchema),
});
export type RangeFilterConfigDto = z.infer<typeof rangeFilterConfigDto>;

export const selectOptionDto = z.object({
  label: nonEmptyStringSchema,
  value: z.union([nonEmptyStringSchema, z.boolean()]),
});
export type SelectOptionDto = z.infer<typeof selectOptionDto>;

export const singleSelectFilterConfigDto = z.object({
  ...filterConfigSharedPropertiesDto.shape,
  kind: z.literal('SINGLE_SELECT'),
  paramKey: nonEmptyStringSchema,
  options: z.array(selectOptionDto),
});
export type SingleSelectFilterConfigDto = z.infer<typeof singleSelectFilterConfigDto>;

export const multiSelectFilterConfigDto = z.object({
  ...filterConfigSharedPropertiesDto.shape,
  kind: z.union([z.literal('MULTI_SELECT'), z.literal('MULTI_SELECT_WITH_SEARCH')]),
  paramKey: nonEmptyStringSchema,
  options: z.array(selectOptionDto),
});
export type MultiSelectFilterConfigDto = z.infer<typeof multiSelectFilterConfigDto>;

export const filterConfigDto = z.record(
  z.string(),
  z.union([
    rangeFilterConfigDto,
    singleSelectFilterConfigDto,
    multiSelectFilterConfigDto,
  ]),
);
export type FilterConfigDto = z.infer<typeof filterConfigDto>;
