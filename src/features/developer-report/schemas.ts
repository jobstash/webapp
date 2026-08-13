import { z } from 'zod';

export const developerReportPointSchema = z.object({
  period: z.string(),
  activePeople: z.number().int().nonnegative(),
  activeMaintainers: z.number().int().nonnegative(),
  activeLeads: z.number().int().nonnegative(),
  activeOrganizations: z.number().int().nonnegative(),
  joins: z.number().int().nonnegative(),
  exits: z.number().int().nonnegative(),
  returns: z.number().int().nonnegative(),
  movements: z.number().int().nonnegative(),
  activityCount: z.number().int().nonnegative(),
  commitCount: z.number().int().nonnegative(),
  mergeCount: z.number().int().nonnegative(),
  oneDayPeople: z.number().int().nonnegative(),
  regularPeople: z.number().int().nonnegative(),
  sustainedPeople: z.number().int().nonnegative(),
  newPeople: z.number().int().nonnegative(),
  establishedPeople: z.number().int().nonnegative(),
  longTenuredPeople: z.number().int().nonnegative(),
});

const retentionCohortSchema = z.object({
  cohortMonth: z.string(),
  cohortSize: z.number().int().nonnegative(),
  retainedMonth3: z.number().min(0).max(1),
  retainedMonth6: z.number().min(0).max(1),
  retainedMonth12: z.number().min(0).max(1),
});

const developerOrganizationSchema = z.object({
  organizationKey: z.string(),
  organizationId: z.string().nullable(),
  organizationName: z.string(),
  organizationSlug: z.string(),
  logoUrl: z.string().nullable(),
  activePeople: z.number().int().nonnegative(),
  activeMaintainers: z.number().int().nonnegative(),
  activeLeads: z.number().int().nonnegative(),
  activePeopleChange12m: z.number().int(),
  joins12m: z.number().int().nonnegative(),
  exits12m: z.number().int().nonnegative(),
  netTeamChange12m: z.number().int(),
  commitCount12m: z.number().int().nonnegative(),
  mergeCount12m: z.number().int().nonnegative(),
  series: z
    .object({
      period: z.string(),
      activePeople: z.number().int().nonnegative(),
    })
    .array(),
});

export const developerReportSchema = z.object({
  available: z.boolean(),
  asOf: z.string().nullable(),
  completeThrough: z.string().nullable(),
  methodologyVersion: z.literal('developer-report-v1'),
  population: z
    .object({
      label: z.string(),
      definition: z.string(),
      excludes: z.string().array(),
    })
    .superRefine(({ excludes }, context) => {
      for (const required of [
        'external contributors',
        'bots',
        'banned organizations',
      ]) {
        if (!excludes.includes(required)) {
          context.addIssue({
            code: 'custom',
            path: ['excludes'],
            message: `Developer report must exclude ${required}`,
          });
        }
      }
    }),
  current: developerReportPointSchema.nullable(),
  history: developerReportPointSchema.array(),
  retention: retentionCohortSchema.array(),
  maintainerLeverage: z.object({
    period: z.string().nullable(),
    maintainerCount: z.number().int().nonnegative(),
    mergedPrCount: z.number().int().nonnegative(),
    medianAuthorsSupported: z.number().nullable(),
    p25AuthorsSupported: z.number().nullable(),
    p75AuthorsSupported: z.number().nullable(),
  }),
  organizations: developerOrganizationSchema.array(),
  movements: z
    .object({
      sourceOrganizationKey: z.string(),
      sourceOrganizationName: z.string(),
      destinationOrganizationKey: z.string(),
      destinationOrganizationName: z.string(),
      people: z.number().int().nonnegative(),
      maintainerMovements: z.number().int().nonnegative(),
    })
    .array(),
});

export type DeveloperReportPoint = z.infer<typeof developerReportPointSchema>;
export type DeveloperReport = z.infer<typeof developerReportSchema>;
export type DeveloperOrganization = DeveloperReport['organizations'][number];
