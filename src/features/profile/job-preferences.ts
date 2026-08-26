import { z } from 'zod';

import { jobListItemSchema } from '@/features/jobs/schemas';
import {
  utcOffsetSchema,
  workArrangementOptionSchema,
  workModeSchema,
} from '@/features/jobs/work-arrangement';
import { nonEmptyStringSchema } from '@/lib/schemas';

export { utcOffsetSchema, workArrangementOptionSchema, workModeSchema };

const preferenceListSchema = z.array(z.string().trim().min(1).max(160)).max(30);

export const jobSearchStatusSchema = z.enum([
  'not_looking',
  'open',
  'active',
  'immediate',
]);
export const educationLevelSchema = z.enum([
  'secondary',
  'associate',
  'bachelor',
  'master',
  'doctorate',
  'other',
]);
export const attendancePreferenceSchema = z.enum([
  'remote_only',
  'remote_preferred',
  'hybrid_ok',
  'onsite_ok',
  'unstated',
]);

export const recommendationPreferenceDefaults = {
  searchStatus: null,
  rolePriorities: [] as string[],
  targetOrganizations: [] as string[],
  languages: [] as string[],
  jobCategories: [] as string[],
  seniorityLevels: [] as string[],
  educationLevel: null,
  companySizeMin: null,
  companySizeMax: null,
  industries: [] as string[],
  preferredSkills: [] as string[],
  minimumSalary: null,
  salaryCurrency: null,
  fundingStages: [] as string[],
  paymentCurrencies: [] as string[],
  commitments: [] as string[],
  showcaseRepositories: [] as string[],
};

export const jobPreferencesSchema = z
  .strictObject({
    workModes: z.array(workModeSchema).min(1),
    residenceCountry: z
      .string()
      .regex(/^[A-Z]{2}$/)
      .nullable(),
    utcOffset: utcOffsetSchema.nullable(),
    workAuthorization: nonEmptyStringSchema.nullable(),
    requiresSponsorship: z.boolean().nullable(),
    attendancePreference: attendancePreferenceSchema.nullable(),
    travelTolerance: nonEmptyStringSchema.nullable(),
    searchStatus: jobSearchStatusSchema.nullable(),
    rolePriorities: preferenceListSchema,
    targetOrganizations: preferenceListSchema,
    languages: preferenceListSchema,
    jobCategories: preferenceListSchema,
    seniorityLevels: preferenceListSchema,
    educationLevel: educationLevelSchema.nullable(),
    companySizeMin: z.number().int().min(0).max(1_000_000).nullable(),
    companySizeMax: z.number().int().min(0).max(1_000_000).nullable(),
    industries: preferenceListSchema,
    preferredSkills: preferenceListSchema,
    minimumSalary: z.number().int().min(0).max(100_000_000).nullable(),
    salaryCurrency: z
      .string()
      .regex(/^[A-Z]{3}$/)
      .nullable(),
    fundingStages: preferenceListSchema,
    paymentCurrencies: preferenceListSchema,
    commitments: preferenceListSchema,
    showcaseRepositories: z.array(z.string().url()).max(20),
  })
  .superRefine((preferences, context) => {
    if (
      preferences.companySizeMin !== null &&
      preferences.companySizeMax !== null &&
      preferences.companySizeMax < preferences.companySizeMin
    ) {
      context.addIssue({
        code: 'custom',
        path: ['companySizeMax'],
        message: 'Maximum company size must be at least the minimum',
      });
    }
  });
export type JobPreferences = z.infer<typeof jobPreferencesSchema>;

export const jobMatchResolutionCodeSchema = z.enum([
  'add_country_for_exclusions',
  'add_country_for_eligibility',
  'geographic_scope_unstated',
  'location_eligibility_incomplete',
  'conflicting_work_arrangement',
  'remote_evidence_unqualified',
  'work_arrangement_unstated',
  'add_utc_offset',
  'work_authorization_review',
  'residency_review',
  'attendance_review',
  'travel_tolerance_review',
  'office_location_review',
  'office_location_missing',
  'sponsorship_unstated',
  'set_sponsorship_preference',
]);
export type JobMatchResolutionCode = z.infer<
  typeof jobMatchResolutionCodeSchema
>;

export const jobForMeSchema = z.strictObject({
  job: jobListItemSchema,
  // A null option is the truthful representation for a job whose latest
  // extraction states no work arrangement. Inventing a mode would turn
  // an unverified inherited source label into eligibility.
  option: workArrangementOptionSchema.nullable(),
  explanation: nonEmptyStringSchema,
  needsChecking: z.array(
    z.strictObject({
      code: jobMatchResolutionCodeSchema,
      message: nonEmptyStringSchema,
    }),
  ),
  optionalSignals: z.array(nonEmptyStringSchema),
});
export type JobForMe = z.infer<typeof jobForMeSchema>;

export const jobsForMeSummarySchema = z
  .strictObject({
    confirmedMatches: z.number().int().nonnegative(),
    timezoneNearMisses: z.number().int().nonnegative(),
    needsChecking: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
  })
  .refine(
    ({ confirmedMatches, timezoneNearMisses, needsChecking, total }) =>
      confirmedMatches + timezoneNearMisses + needsChecking === total,
    { message: 'Jobs For Me summary counts must reconcile exactly' },
  );

export const jobsForMeResponseSchema = z
  .strictObject({
    confirmedMatches: z.array(jobForMeSchema),
    timezoneNearMisses: z.array(jobForMeSchema),
    needsChecking: z.array(jobForMeSchema),
    summary: jobsForMeSummarySchema,
    appliedPreferences: jobPreferencesSchema,
  })
  .superRefine((response, context) => {
    const counts = {
      confirmedMatches: response.confirmedMatches.length,
      timezoneNearMisses: response.timezoneNearMisses.length,
      needsChecking: response.needsChecking.length,
    };

    for (const [key, count] of Object.entries(counts)) {
      if (response.summary[key as keyof typeof counts] !== count) {
        context.addIssue({
          code: 'custom',
          path: ['summary', key],
          message: `${key} must equal the corresponding result count`,
        });
      }
    }
  });
export type JobsForMeResponse = z.infer<typeof jobsForMeResponseSchema>;
