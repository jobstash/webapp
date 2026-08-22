import { z } from 'zod';

import { nonEmptyStringSchema } from '@/lib/schemas';

export const workModeSchema = z.enum(['remote', 'hybrid', 'onsite']);

export const utcOffsetSchema = z
  .number()
  .finite()
  .min(-12)
  .max(14)
  .multipleOf(0.25);

export const workArrangementClassificationSchema = z.enum([
  'verified_remote',
  'verified_hybrid',
  'verified_onsite',
  'remote_unqualified',
  'conflicting',
  'unstated',
]);

export const workArrangementScopeSchema = z.enum([
  'global',
  'region',
  'country_list',
  'unstated',
]);

export const workArrangementRegionSchema = z.enum([
  'EU',
  'Europe',
  'EMEA',
  'AMER',
  'LATAM',
  'APAC',
]);

export const utcBandSchema = z
  .strictObject({
    minimumUtcOffset: utcOffsetSchema,
    maximumUtcOffset: utcOffsetSchema,
  })
  .refine(
    ({ minimumUtcOffset, maximumUtcOffset }) =>
      minimumUtcOffset <= maximumUtcOffset,
    { message: 'UTC band minimum must not exceed its maximum' },
  );

export const workArrangementEvidenceSchema = z
  .strictObject({
    quote: nonEmptyStringSchema,
    startOffset: z.number().int().nonnegative(),
    endOffset: z.number().int().positive(),
    source: z.enum([
      'employer_body',
      'employer_ats_field',
      'verified_employer_policy',
      'aggregator',
    ]),
    trust: z.enum([
      'employer_body',
      'employer_ats_field',
      'verified_employer_policy',
      'aggregator',
    ]),
    provenance: nonEmptyStringSchema,
  })
  .refine(({ quote, startOffset, endOffset }) => {
    return endOffset > startOffset && endOffset - startOffset === quote.length;
  }, 'Evidence offsets must exactly span the quoted text');

export const workArrangementOptionSchema = z.strictObject({
  classification: workArrangementClassificationSchema,
  mode: workModeSchema,
  scope: workArrangementScopeSchema,
  includedCountries: z.array(z.string().regex(/^[A-Z]{2}$/)),
  excludedCountries: z.array(z.string().regex(/^[A-Z]{2}$/)),
  includedRegions: z.array(workArrangementRegionSchema),
  excludedRegions: z.array(workArrangementRegionSchema),
  requiredUtcBand: utcBandSchema.nullable(),
  preferredUtcBand: utcBandSchema.nullable(),
  residencyRequirements: z.array(nonEmptyStringSchema),
  workAuthorizationRequirements: z.array(nonEmptyStringSchema),
  sponsorshipStatus: z.enum([
    'available',
    'unavailable',
    'case_by_case',
    'unstated',
  ]),
  officeCity: nonEmptyStringSchema.nullable(),
  attendanceCadence: nonEmptyStringSchema.nullable(),
  travelRequirement: nonEmptyStringSchema.nullable(),
  evidence: z.array(workArrangementEvidenceSchema),
  confidence: z.enum(['source_stated', 'parsed', 'inherited']),
});

export const workArrangementV1Schema = z.strictObject({
  classification: workArrangementClassificationSchema,
  // Keep the three employer-authored arms separate. In particular, a
  // remote-or-office statement must not collapse into one synthetic mode.
  remoteOptions: z.array(workArrangementOptionSchema),
  hybridOptions: z.array(workArrangementOptionSchema),
  onsiteOptions: z.array(workArrangementOptionSchema),
});

export type WorkArrangementOption = z.infer<typeof workArrangementOptionSchema>;
export type WorkArrangementV1 = z.infer<typeof workArrangementV1Schema>;
