import * as v from 'valibot';

export const nonEmptyStringSchema = v.pipe(v.string(), v.nonEmpty());
export const nullableStringSchema = v.nullable(nonEmptyStringSchema);
export const optionalStringSchema = v.optional(nonEmptyStringSchema);
export const nullableNumberSchema = v.nullable(v.number());
export const nullableBooleanSchema = v.nullable(v.boolean());

export const mappedInfoTagSchema = v.object({
  iconKey: nonEmptyStringSchema,
  label: nonEmptyStringSchema,
  href: optionalStringSchema,
});
export type MappedInfoTagSchema = v.InferOutput<typeof mappedInfoTagSchema>;
