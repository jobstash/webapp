import { z } from 'zod';

import { nonEmptyStringSchema } from '@/lib/schemas';
import { FILTER_KIND } from '@/features/filters/constants';

export const filterConfigSharedPropertiesSchema = z.object({
  position: z.number(),
  label: nonEmptyStringSchema,
  analytics: z.object({
    id: z.nullish(nonEmptyStringSchema),
    name: z.nullish(nonEmptyStringSchema),
  }),
  isSuggested: z.optional(z.boolean()),
});

export type FilterConfigSharedPropertiesSchema = z.infer<
  typeof filterConfigSharedPropertiesSchema
>;

export const selectOptionsSchema = z.object({
  label: nonEmptyStringSchema,
  value: nonEmptyStringSchema,
});
export type SelectOptionsSchema = z.infer<typeof selectOptionsSchema>;

export const selectConfigSharedPropertiesSchema = z.object({
  options: z.array(selectOptionsSchema),
  paramKey: nonEmptyStringSchema,
});
export type SelectConfigSharedPropertiesSchema = z.infer<
  typeof selectConfigSharedPropertiesSchema
>;

export const switchFilterConfigSchema = z.object({
  ...filterConfigSharedPropertiesSchema.shape,
  kind: z.literal(FILTER_KIND.SWITCH),
  paramKey: nonEmptyStringSchema,
});
export type SwitchFilterConfigSchema = z.infer<typeof switchFilterConfigSchema>;

export const radioFilterConfigSchema = z.object({
  ...filterConfigSharedPropertiesSchema.shape,
  ...selectConfigSharedPropertiesSchema.shape,
  kind: z.literal(FILTER_KIND.RADIO),
});
export type RadioFilterConfigSchema = z.infer<typeof radioFilterConfigSchema>;

export const sortFilterConfigSchema = z.object({
  ...filterConfigSharedPropertiesSchema.shape,
  ...selectConfigSharedPropertiesSchema.shape,
  kind: z.literal(FILTER_KIND.SORT),
});
export type SortFilterConfigSchema = z.infer<typeof sortFilterConfigSchema>;

export const singleSelectFilterConfigSchema = z.object({
  ...filterConfigSharedPropertiesSchema.shape,
  ...selectConfigSharedPropertiesSchema.shape,
  kind: z.literal(FILTER_KIND.SINGLE_SELECT),
});
export type SingleSelectFilterConfigSchema = z.infer<
  typeof singleSelectFilterConfigSchema
>;

export const checkboxFilterConfigSchema = z.object({
  ...filterConfigSharedPropertiesSchema.shape,
  ...selectConfigSharedPropertiesSchema.shape,
  kind: z.literal(FILTER_KIND.CHECKBOX),
});
export type CheckboxFilterConfigSchema = z.infer<
  typeof checkboxFilterConfigSchema
>;

export const multiSelectFilterConfigSchema = z.object({
  ...filterConfigSharedPropertiesSchema.shape,
  ...selectConfigSharedPropertiesSchema.shape,
  kind: z.literal(FILTER_KIND.MULTI_SELECT),
});
export type MultiSelectFilterConfigSchema = z.infer<
  typeof multiSelectFilterConfigSchema
>;

export const filterConfigSchema = z.union([
  switchFilterConfigSchema,
  radioFilterConfigSchema,
  sortFilterConfigSchema,
  singleSelectFilterConfigSchema,
  checkboxFilterConfigSchema,
  multiSelectFilterConfigSchema,
]);
export type FilterConfigSchema = z.infer<typeof filterConfigSchema>;
