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

/**
 * Geographic coordinates for LocalBusiness rich results
 */
export const geoSchema = z.object({
  /** Latitude coordinate (min 5 decimal places for accuracy) */
  latitude: z.number(),
  /** Longitude coordinate (min 5 decimal places for accuracy) */
  longitude: z.number(),
});

/**
 * Structured address schema for job locations
 * Supports both physical addresses and remote positions
 */
export const addressSchema = z.object({
  /** Display name of the country (e.g., "United States", "Philippines") */
  country: nonEmptyStringSchema,
  /** ISO 3166-1 alpha-2 country code (e.g., "US", "PH") */
  countryCode: nonEmptyStringSchema,
  /** Whether this is a remote position */
  isRemote: z.boolean(),
  /** City or municipality */
  locality: z.string().optional(),
  /** State, province, or region (e.g., "CA", "Cebu") */
  region: z.string().optional(),
  /** Postal code */
  postalCode: z.string().optional(),
  /** Primary street address */
  street: z.string().optional(),
  /** Apartment, suite, unit, building, floor, c/o */
  extendedAddress: z.string().optional(),
  /** Geographic coordinates for LocalBusiness rich results */
  geo: geoSchema.optional(),
});
export type Address = z.infer<typeof addressSchema>;
