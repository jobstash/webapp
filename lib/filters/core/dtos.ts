import * as v from 'valibot';

import { nonEmptyStringSchema } from '@/lib/shared/core/schemas';

import { FILTER_KIND } from './constants';

export const filterConfigSharedPropertiesDto = v.object({
  position: v.number(),
  label: nonEmptyStringSchema,
  show: v.boolean(),
  googleAnalyticsEventId: v.nullish(nonEmptyStringSchema),
  googleAnalyticsEventName: v.nullish(nonEmptyStringSchema),
});

const rangeFilterConfigValueDto = v.object({
  value: v.pipe(v.number(), v.minValue(0)),
  paramKey: nonEmptyStringSchema,
});

export const rangeFilterConfigDto = v.object({
  ...filterConfigSharedPropertiesDto.entries,
  kind: v.literal(FILTER_KIND.RANGE),
  value: v.object({
    lowest: rangeFilterConfigValueDto,
    highest: rangeFilterConfigValueDto,
  }),
  prefix: v.nullish(nonEmptyStringSchema),
});
export type RangeFilterConfigDto = v.InferOutput<typeof rangeFilterConfigDto>;

export const selectOptionsDto = v.array(
  v.object({
    label: nonEmptyStringSchema,
    value: v.union([nonEmptyStringSchema, v.boolean()]),
  }),
);

export const singleSelectFilterConfigDto = v.object({
  ...filterConfigSharedPropertiesDto.entries,
  kind: v.literal(FILTER_KIND.SINGLE_SELECT),
  paramKey: nonEmptyStringSchema,
  options: selectOptionsDto,
});

export const multiSelectFilterConfigDto = v.object({
  ...filterConfigSharedPropertiesDto.entries,
  kind: v.union([
    v.literal(FILTER_KIND.MULTI_SELECT),
    v.literal(FILTER_KIND.MULTI_SELECT_WITH_SEARCH),
  ]),
  paramKey: nonEmptyStringSchema,
  options: selectOptionsDto,
});

export const filterConfigSchema = v.record(
  v.string(),
  v.union([
    rangeFilterConfigDto,
    singleSelectFilterConfigDto,
    multiSelectFilterConfigDto,
  ]),
);
