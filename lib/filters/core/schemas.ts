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
  isSuggested: v.optional(v.boolean()),
});

export type FilterConfigSharedPropertiesSchema = v.InferOutput<
  typeof filterConfigSharedPropertiesSchema
>;

export const selectOptionsSchema = v.object({
  label: nonEmptyStringSchema,
  value: nonEmptyStringSchema,
});
export type SelectOptionsSchema = v.InferOutput<typeof selectOptionsSchema>;

export const selectConfigSharedPropertiesSchema = v.object({
  options: v.array(selectOptionsSchema),
  paramKey: nonEmptyStringSchema,
});
export type SelectConfigSharedPropertiesSchema = v.InferOutput<
  typeof selectConfigSharedPropertiesSchema
>;

export const switchFilterConfigSchema = v.object({
  ...filterConfigSharedPropertiesSchema.entries,
  kind: v.literal(FILTER_KIND.SWITCH),
  paramKey: nonEmptyStringSchema,
});
export type SwitchFilterConfigSchema = v.InferOutput<typeof switchFilterConfigSchema>;

export const radioFilterConfigSchema = v.object({
  ...filterConfigSharedPropertiesSchema.entries,
  ...selectConfigSharedPropertiesSchema.entries,
  kind: v.literal(FILTER_KIND.RADIO),
});
export type RadioFilterConfigSchema = v.InferOutput<typeof radioFilterConfigSchema>;

export const sortFilterConfigSchema = v.object({
  ...filterConfigSharedPropertiesSchema.entries,
  ...selectConfigSharedPropertiesSchema.entries,
  kind: v.literal(FILTER_KIND.SORT),
});
export type SortFilterConfigSchema = v.InferOutput<typeof sortFilterConfigSchema>;

export const singleSelectFilterConfigSchema = v.object({
  ...filterConfigSharedPropertiesSchema.entries,
  ...selectConfigSharedPropertiesSchema.entries,
  kind: v.literal(FILTER_KIND.SINGLE_SELECT),
});
export type SingleSelectFilterConfigSchema = v.InferOutput<
  typeof singleSelectFilterConfigSchema
>;

export const checkboxFilterConfigSchema = v.object({
  ...filterConfigSharedPropertiesSchema.entries,
  ...selectConfigSharedPropertiesSchema.entries,
  kind: v.literal(FILTER_KIND.CHECKBOX),
});
export type CheckboxFilterConfigSchema = v.InferOutput<typeof checkboxFilterConfigSchema>;

export const multiSelectFilterConfigSchema = v.object({
  ...filterConfigSharedPropertiesSchema.entries,
  ...selectConfigSharedPropertiesSchema.entries,
  kind: v.literal(FILTER_KIND.MULTI_SELECT),
});
export type MultiSelectFilterConfigSchema = v.InferOutput<
  typeof multiSelectFilterConfigSchema
>;

export const filterConfigSchema = v.union([
  switchFilterConfigSchema,
  radioFilterConfigSchema,
  sortFilterConfigSchema,
  singleSelectFilterConfigSchema,
  checkboxFilterConfigSchema,
  multiSelectFilterConfigSchema,
]);
export type FilterConfigSchema = v.InferOutput<typeof filterConfigSchema>;
