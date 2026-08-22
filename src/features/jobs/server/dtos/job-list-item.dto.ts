import 'server-only';

import { z } from 'zod';

import {
  nonEmptyStringSchema,
  nullableBooleanSchema,
  nullableNumberSchema,
  nullableStringSchema,
  optionalStringSchema,
} from '@/lib/schemas';
import { fundingRoundDto, investorDto, tagDto } from '@/lib/server/dtos';
import { workArrangementV1Schema } from '@/features/jobs/work-arrangement';

export const jobOrgProjectDto = z.object({
  id: nonEmptyStringSchema,
  name: nullableStringSchema,
  logo: optionalStringSchema,
  logoUrl: optionalStringSchema,
  website: optionalStringSchema,
  category: optionalStringSchema,
});
export type JobOrgProjectDto = z.infer<typeof jobOrgProjectDto>;

const jobEmployerProjectDto = z.object({
  id: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
  normalizedName: nonEmptyStringSchema,
  logo: nullableStringSchema.optional(),
  website: nullableStringSchema.optional(),
  summary: nullableStringSchema.optional(),
  description: nullableStringSchema.optional(),
  category: nullableStringSchema.optional(),
  github: nullableStringSchema.optional(),
  twitter: nullableStringSchema.optional(),
  telegram: nullableStringSchema.optional(),
  discord: nullableStringSchema.optional(),
  docs: nullableStringSchema.optional(),
  fundingRounds: fundingRoundDto.array().optional(),
  investors: investorDto.array().optional(),
  fundingStage: nullableStringSchema.optional(),
  recentlyFunded: z.boolean().optional(),
  teamCoverageStatus: z.enum(['current', 'unknown']).nullable().optional(),
  teamSignalsAsOf: nullableStringSchema.optional(),
  currentMaintainerCount: nullableNumberSchema.optional(),
  activeLeadCount: nullableNumberSchema.optional(),
  newActiveLeadCount: nullableNumberSchema.optional(),
  steppedDownLeadCount: nullableNumberSchema.optional(),
  movedLeadCount: nullableNumberSchema.optional(),
  earlyLeadDepartureCount: nullableNumberSchema.optional(),
});

export const jobAvailabilityDto = z.object({
  requirement: z.enum(['required', 'preferred']),
  workMode: z.enum(['remote', 'hybrid', 'onsite']).optional(),
  placeId: nonEmptyStringSchema.optional(),
  placeName: nonEmptyStringSchema.optional(),
  placeText: nonEmptyStringSchema.optional(),
  placeKind: z
    .enum([
      'city',
      'administrative_area',
      'country',
      'world_region',
      'continent',
      'business_region',
    ])
    .optional(),
  ancestorPlaceIds: nonEmptyStringSchema.array().optional(),
  placeTimezoneIds: nonEmptyStringSchema.array().optional(),
  timezoneKind: nonEmptyStringSchema.optional(),
  timezone: nonEmptyStringSchema.optional(),
  minimumUtcOffsetMinutes: z.number().optional(),
  maximumUtcOffsetMinutes: z.number().optional(),
  rawText: nonEmptyStringSchema,
  confidence: z.number().min(0).max(1),
  extractorVersion: nonEmptyStringSchema,
});
export type JobAvailabilityDto = z.infer<typeof jobAvailabilityDto>;

const jobListItemBaseDto = z.object({
  id: nonEmptyStringSchema,
  title: nullableStringSchema,
  url: nullableStringSchema,
  shortUUID: nonEmptyStringSchema,
  timestamp: z.number(),
  // Optional until MW emits it; true = the publish date is verified (not a
  // resurrected/re-scraped posting).
  publishedTimestampIsVerified: z.boolean().optional(),
  summary: nullableStringSchema,

  seniority: nullableStringSchema,
  salary: nullableNumberSchema,
  minimumSalary: nullableNumberSchema,
  maximumSalary: nullableNumberSchema,
  location: nullableStringSchema,
  locationType: nullableStringSchema,
  commitment: nullableStringSchema,
  paysInCrypto: nullableBooleanSchema,
  offersTokenAllocation: nullableBooleanSchema,
  salaryCurrency: nullableStringSchema,
  classification: nullableStringSchema,
  workArrangement: workArrangementV1Schema.nullable().optional().default(null),
  tags: tagDto.array(),
  availability: jobAvailabilityDto.array().optional(),

  access: z.enum(['public', 'protected']),
  featured: z.boolean(),
  featureStartDate: nullableNumberSchema,
  featureEndDate: nullableNumberSchema,
  onboardIntoWeb3: z.boolean(),

  organization: z
    .object({
      id: nonEmptyStringSchema,
      name: nonEmptyStringSchema,
      normalizedName: nonEmptyStringSchema,
      orgId: nonEmptyStringSchema,
      website: nullableStringSchema,
      // Tolerate missing/empty org copy — a required nonEmpty here would
      // drop the whole job (and fail entire pillar pages) on one bad org.
      summary: optionalStringSchema,
      location: optionalStringSchema,
      description: optionalStringSchema,
      logoUrl: nullableStringSchema,
      headcountEstimate: nullableNumberSchema,
      fundingRounds: fundingRoundDto.array(),
      investors: investorDto.array(),
      fundingStage: nullableStringSchema.optional(),
      recentlyFunded: z.boolean().optional(),
      teamCoverageStatus: z.enum(['current', 'unknown']).nullable().optional(),
      teamSignalsAsOf: nullableStringSchema.optional(),
      currentMaintainerCount: nullableNumberSchema.optional(),
      activeLeadCount: nullableNumberSchema.optional(),
      newActiveLeadCount: nullableNumberSchema.optional(),
      steppedDownLeadCount: nullableNumberSchema.optional(),
      movedLeadCount: nullableNumberSchema.optional(),
      earlyLeadDepartureCount: nullableNumberSchema.optional(),
      // Enriched org metadata — emitted by /jobs/details and the pillar
      // static endpoint; absent on /jobs/list.
      discord: optionalStringSchema,
      telegram: optionalStringSchema,
      twitter: optionalStringSchema,
      github: optionalStringSchema,
      docs: optionalStringSchema,
      projects: jobOrgProjectDto.array().optional(),
    })
    .nullable(),
  project: jobEmployerProjectDto.nullable(),
});

const requireExactlyOneEmployer = (
  value: z.infer<typeof jobListItemBaseDto>,
  context: z.RefinementCtx,
) => {
  if ((value.organization === null) === (value.project === null)) {
    context.addIssue({
      code: 'custom',
      message: 'A job must have exactly one organization or project employer',
      path: ['organization'],
    });
  }
};

export const jobListItemDto = jobListItemBaseDto.superRefine(
  requireExactlyOneEmployer,
);
export type JobListItemDto = z.infer<typeof jobListItemDto>;

export const extendJobListItemDto = <T extends z.ZodRawShape>(shape: T) =>
  jobListItemBaseDto
    .extend(shape)
    .superRefine((value, context) =>
      requireExactlyOneEmployer(
        value as z.infer<typeof jobListItemBaseDto>,
        context,
      ),
    );
