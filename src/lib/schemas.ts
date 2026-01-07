import { z } from 'zod';

export const nonEmptyStringSchema = z.string().min(1);
export const nullableStringSchema = nonEmptyStringSchema.nullable();
export const nullableNumberSchema = z.number().nullable();
export const nullableBooleanSchema = z.boolean().nullable();
export const optionalStringSchema = nullableStringSchema.optional();

export const mappedInfoTagSchema = z.object({
  iconKey: nonEmptyStringSchema,
  label: nonEmptyStringSchema,
  href: optionalStringSchema,
});
export type MappedInfoTagSchema = z.infer<typeof mappedInfoTagSchema>;
