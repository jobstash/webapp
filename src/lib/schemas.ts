import { z } from 'zod';

export const nonEmptyStringSchema = z.string().min(1);
export const nullableStringSchema = z
  .string()
  .nullable()
  .transform((val) => (val === '' ? null : val));
export const nullableNumberSchema = z.number().nullable();
export const nullableBooleanSchema = z.boolean().nullable();
export const optionalStringSchema = nullableStringSchema.optional();

export const mappedInfoTagSchema = z.object({
  iconKey: nonEmptyStringSchema,
  label: nonEmptyStringSchema,
  href: optionalStringSchema,
});
export type MappedInfoTagSchema = z.infer<typeof mappedInfoTagSchema>;

export const geoSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export const addressSchema = z.object({
  country: nonEmptyStringSchema,
  countryCode: nonEmptyStringSchema,
  isRemote: z.boolean(),
  locality: z.string().optional(),
  region: z.string().optional(),
  postalCode: z.string().optional(),
  street: z.string().optional(),
  extendedAddress: z.string().optional(),
  geo: geoSchema.optional(),
});
export type Address = z.infer<typeof addressSchema>;

export const messageResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().min(1),
});
export type MessageResponse = z.infer<typeof messageResponseSchema>;
