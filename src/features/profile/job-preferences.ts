import { z } from 'zod';

import { jobListItemSchema } from '@/features/jobs/schemas';
import {
  utcOffsetSchema,
  workArrangementOptionSchema,
  workModeSchema,
} from '@/features/jobs/work-arrangement';
import { nonEmptyStringSchema } from '@/lib/schemas';

export { utcOffsetSchema, workArrangementOptionSchema, workModeSchema };

// These are the seven canonical search/matching preferences. Keeping this
// object strict prevents removed aliases from silently narrowing results.
export const jobPreferencesSchema = z.strictObject({
  workModes: z.array(workModeSchema).min(1),
  residenceCountry: z
    .string()
    .regex(/^[A-Z]{2}$/)
    .nullable(),
  utcOffset: utcOffsetSchema.nullable(),
  workAuthorization: nonEmptyStringSchema.nullable(),
  requiresSponsorship: z.boolean().nullable(),
  attendancePreference: nonEmptyStringSchema.nullable(),
  travelTolerance: nonEmptyStringSchema.nullable(),
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
  // missing employer evidence into eligibility.
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
