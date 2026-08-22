import { z } from 'zod';

import { nonEmptyStringSchema, nullableStringSchema } from '@/lib/schemas';

const profileFacetSchema = z
  .union([nonEmptyStringSchema, z.array(nonEmptyStringSchema)])
  .nullish();

const publicHttpUrlSchema = nonEmptyStringSchema.refine((value) => {
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}, 'Expected a public HTTP(S) URL');

export const publicProfileSchema = z.strictObject({
  id: nullableStringSchema,
  slug: nonEmptyStringSchema,
  canonicalSlug: nonEmptyStringSchema,
  category: nullableStringSchema,
  info: z.strictObject({
    displayName: nonEmptyStringSchema,
    description: nullableStringSchema.optional(),
    logo: publicHttpUrlSchema.nullable().optional(),
    canonicalSite: publicHttpUrlSchema.nullable().optional(),
    tagline: nullableStringSchema.optional(),
    foundingDate: nullableStringSchema.optional(),
    profileType: profileFacetSchema,
    profileSector: profileFacetSchema,
    profileStatus: profileFacetSchema,
  }),
  children: z.array(
    z.strictObject({
      id: nullableStringSchema.optional(),
      type: z.enum(['organization', 'project']),
      name: nonEmptyStringSchema,
      slug: nullableStringSchema.optional(),
      logo: nullableStringSchema.optional(),
      summary: nullableStringSchema.optional(),
    }),
  ),
  reviews: z.strictObject({
    count: z.number().int().nonnegative(),
    averageRating: z.number().min(0).max(5).nullable(),
  }),
  salaries: z.strictObject({
    count: z.number().int().nonnegative(),
    byCurrency: z.array(
      z.strictObject({
        currency: z.string().regex(/^[A-Z]{3}$/),
        count: z.number().int().positive(),
        average: z.number().nonnegative(),
        minimum: z.number().nonnegative(),
        maximum: z.number().nonnegative(),
      }),
    ),
  }),
  notices: z.array(
    z.strictObject({
      id: nonEmptyStringSchema,
      text: nonEmptyStringSchema,
      decidedAt: nonEmptyStringSchema,
    }),
  ),
});

export const publicProfileResponseSchema = z.strictObject({
  success: z.literal(true),
  message: nonEmptyStringSchema,
  data: publicProfileSchema,
});

export type PublicProfile = z.infer<typeof publicProfileSchema>;
