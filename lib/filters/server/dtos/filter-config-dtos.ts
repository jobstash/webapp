import 'server-only';

import * as v from 'valibot';

import { nonEmptyStringSchema } from '@/lib/shared/core/schemas';

export const filterConfigSharedPropertiesDto = v.object({
  position: v.number(),
  label: nonEmptyStringSchema,
  show: v.boolean(),
  googleAnalyticsEventId: v.nullish(nonEmptyStringSchema),
  googleAnalyticsEventName: v.nullish(nonEmptyStringSchema),
});
export type FilterConfigSharedPropertiesDto = v.InferOutput<
  typeof filterConfigSharedPropertiesDto
>;

const rangeFilterConfigValueDto = v.object({
  value: v.pipe(v.number(), v.minValue(0)),
  paramKey: nonEmptyStringSchema,
});
export type RangeFilterConfigValueDto = v.InferOutput<typeof rangeFilterConfigValueDto>;

export const rangeFilterConfigDto = v.object({
  ...filterConfigSharedPropertiesDto.entries,
  kind: v.literal('RANGE'),
  value: v.object({
    lowest: rangeFilterConfigValueDto,
    highest: rangeFilterConfigValueDto,
  }),
  prefix: v.nullish(nonEmptyStringSchema),
});
export type RangeFilterConfigDto = v.InferOutput<typeof rangeFilterConfigDto>;

export const selectOptionDto = v.object({
  label: nonEmptyStringSchema,
  value: v.union([nonEmptyStringSchema, v.boolean()]),
});
export type SelectOptionDto = v.InferOutput<typeof selectOptionDto>;

export const singleSelectFilterConfigDto = v.object({
  ...filterConfigSharedPropertiesDto.entries,
  kind: v.literal('SINGLE_SELECT'),
  paramKey: nonEmptyStringSchema,
  options: v.array(selectOptionDto),
});
export type SingleSelectFilterConfigDto = v.InferOutput<
  typeof singleSelectFilterConfigDto
>;

export const multiSelectFilterConfigDto = v.object({
  ...filterConfigSharedPropertiesDto.entries,
  kind: v.union([v.literal('MULTI_SELECT'), v.literal('MULTI_SELECT_WITH_SEARCH')]),
  paramKey: nonEmptyStringSchema,
  options: v.array(selectOptionDto),
});
export type MultiSelectFilterConfigDto = v.InferOutput<typeof multiSelectFilterConfigDto>;

export const filterConfigDto = v.record(
  v.string(),
  v.union([
    rangeFilterConfigDto,
    singleSelectFilterConfigDto,
    multiSelectFilterConfigDto,
  ]),
);
export type FilterConfigDto = v.InferOutput<typeof filterConfigDto>;
