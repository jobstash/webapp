import * as v from 'valibot';

import { nonEmptyStringSchema } from '@/lib/shared/core/schemas';
import { FILTER_KIND } from '@/lib/filters/core/constants';

export const filterConfigSharedPropertiesSchema = v.object({
  position: v.number(),
  label: nonEmptyStringSchema,
  analytics: v.object({
    id: v.nullish(nonEmptyStringSchema),
    name: v.nullish(nonEmptyStringSchema),
  }),
  isSuggested: v.optional(v.boolean()), // Appears suggested in filters aside section
});
export type FilterConfigSharedPropertiesSchema = v.InferOutput<
  typeof filterConfigSharedPropertiesSchema
>;

export const rangeValueSchema = v.object({
  value: v.pipe(v.number(), v.minValue(0)),
  paramKey: nonEmptyStringSchema,
});
export type RangeValueSchema = v.InferOutput<typeof rangeValueSchema>;
export const rangeFilterConfigSchema = v.object({
  ...filterConfigSharedPropertiesSchema.entries,
  kind: v.literal(FILTER_KIND.RANGE),
  min: rangeValueSchema,
  max: rangeValueSchema,
  unit: v.nullish(nonEmptyStringSchema),
});
export type RangeFilterConfigSchema = v.InferOutput<typeof rangeFilterConfigSchema>;

export const selectOptionsSchema = v.object({
  label: nonEmptyStringSchema,
  value: nonEmptyStringSchema,
});
export type SelectOptionsSchema = v.InferOutput<typeof selectOptionsSchema>;

export const switchFilterConfigSchema = v.object({
  ...filterConfigSharedPropertiesSchema.entries,
  kind: v.literal(FILTER_KIND.SWITCH),
  paramKey: nonEmptyStringSchema,
});
export type SwitchFilterConfigSchema = v.InferOutput<typeof switchFilterConfigSchema>;

export const radioFilterConfigSchema = v.object({
  ...filterConfigSharedPropertiesSchema.entries,
  kind: v.literal(FILTER_KIND.RADIO),
  options: v.array(selectOptionsSchema),
  paramKey: nonEmptyStringSchema,
});
export type RadioFilterConfigSchema = v.InferOutput<typeof radioFilterConfigSchema>;

export const singleSelectFilterConfigSchema = v.object({
  ...filterConfigSharedPropertiesSchema.entries,
  kind: v.literal(FILTER_KIND.SINGLE_SELECT),
  options: v.array(selectOptionsSchema),
  paramKey: nonEmptyStringSchema,
});
export type SingleSelectFilterConfigSchema = v.InferOutput<
  typeof singleSelectFilterConfigSchema
>;

export const checkboxFilterConfigSchema = v.object({
  ...filterConfigSharedPropertiesSchema.entries,
  kind: v.literal(FILTER_KIND.CHECKBOX),
  options: v.array(selectOptionsSchema),
  paramKey: nonEmptyStringSchema,
});
export type CheckboxFilterConfigSchema = v.InferOutput<typeof checkboxFilterConfigSchema>;

export const multiSelectFilterConfigSchema = v.object({
  ...filterConfigSharedPropertiesSchema.entries,
  kind: v.literal(FILTER_KIND.MULTI_SELECT),
  options: v.array(selectOptionsSchema),
  paramKey: nonEmptyStringSchema,
});
export type MultiSelectFilterConfigSchema = v.InferOutput<
  typeof multiSelectFilterConfigSchema
>;

export const filterConfigItemSchema = v.union([
  rangeFilterConfigSchema,
  switchFilterConfigSchema,
  radioFilterConfigSchema,
  singleSelectFilterConfigSchema,
  checkboxFilterConfigSchema,
  multiSelectFilterConfigSchema,
]);
export type FilterConfigItemSchema = v.InferOutput<typeof filterConfigItemSchema>;
