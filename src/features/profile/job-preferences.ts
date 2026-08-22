import { z } from 'zod';

import { jobListItemSchema } from '@/features/jobs/schemas';

export const workModeSchema = z.enum([
  'remote',
  'hybrid',
  'onsite',
  'remote_or_office',
]);

export const jobPreferencesSchema = z.object({
  residenceCountry: z
    .string()
    .regex(/^[A-Z]{2}$/)
    .nullable(),
  residenceRegion: z.string().nullable(),
  ianaTimezone: z.string().nullable(),
  workAuthorizations: z.array(z.string()),
  needsSponsorship: z.boolean().nullable(),
  acceptableWorkModes: z.array(workModeSchema),
  travelTolerance: z.string().nullable(),
  useInferredCollaborationHours: z.boolean(),
});
export type JobPreferences = z.infer<typeof jobPreferencesSchema>;

export const workLocationOptionSchema = z.object({
  mode: workModeSchema,
  scope: z.enum(['global', 'region_list', 'country_list', 'unstated']),
  countries: z.array(z.string()),
  regions: z.array(z.string()),
  minimumUtcOffsetMinutes: z.number().nullable(),
  maximumUtcOffsetMinutes: z.number().nullable(),
  timezonePreferenceStrength: z.enum(['required', 'preferred', 'unstated']),
  residencyRequirement: z.string().nullable(),
  workAuthorization: z.string().nullable(),
  sponsorship: z.enum(['available', 'unavailable', 'unstated']),
  officeLocation: z.record(z.string(), z.unknown()).nullable(),
  attendanceCadence: z.string().nullable(),
  confidence: z.coerce.number(),
  employerAuthoredRemoteEvidence: z.boolean(),
  evidence: z.array(
    z.object({
      text: z.string(),
      source: z.enum([
        'job_description',
        'career_policy',
        'employer_metadata',
        'aggregator_metadata',
      ]),
    }),
  ),
});

export const jobForMeSchema = z.object({
  job: jobListItemSchema,
  option: workLocationOptionSchema,
  confirmed: z.boolean(),
  explanation: z.string(),
  needsChecking: z.array(z.string()),
  optionalSignals: z.array(z.string()),
});
export type JobForMe = z.infer<typeof jobForMeSchema>;
