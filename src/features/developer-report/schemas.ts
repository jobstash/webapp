import { z } from 'zod';

const developerSectorSchema = z.enum([
  'crypto',
  'fintech',
  'ai',
  'banking',
  'tech',
]);

export const developerCohortSchema = z.enum([
  'all',
  ...developerSectorSchema.options,
]);

const growthSchema = z.object({
  oneYear: z.number().nullable(),
  twoYear: z.number().nullable(),
  threeYear: z.number().nullable(),
});

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
  singleChainPeople: z.number().int().nonnegative(),
  multiChainPeople: z.number().int().nonnegative(),
  unmappedChainPeople: z.number().int().nonnegative(),
  newcomerPeople: z.number().int().nonnegative(),
  emergingPeople: z.number().int().nonnegative(),
  establishedPeople: z.number().int().nonnegative(),
});

const cohortScopeSchema = z.object({
  cohort: developerCohortSchema,
  label: z.string(),
  activePeople: z.number().int().nonnegative(),
  activeMaintainers: z.number().int().nonnegative(),
  activeOrganizations: z.number().int().nonnegative(),
});

const chainScopeSchema = z.object({
  chainId: z.string(),
  chainSlug: z.string(),
  chainName: z.string(),
  logoUrl: z.string().nullable(),
  activePeople: z.number().int().nonnegative(),
  activeMaintainers: z.number().int().nonnegative(),
  activeLeads: z.number().int().nonnegative(),
  establishedPeople: z.number().int().nonnegative(),
  activeOrganizations: z.number().int().nonnegative(),
  repositoryCount: z.number().int().nonnegative(),
  growth: growthSchema,
});

const developerOrganizationSchema = z.object({
  organizationKey: z.string(),
  organizationId: z.string().nullable(),
  organizationName: z.string(),
  organizationSlug: z.string(),
  cohort: developerSectorSchema,
  logoUrl: z.string().nullable(),
  layoutX: z.number().nullable(),
  layoutY: z.number().nullable(),
  communityId: z.number().int().nonnegative().nullable(),
  activePeople: z.number().int().nonnegative(),
  activeMaintainers: z.number().int().nonnegative(),
  activeLeads: z.number().int().nonnegative(),
  establishedPeople: z.number().int().nonnegative(),
  growth: growthSchema,
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
  methodologyVersion: z.literal('developer-report-v2'),
  scope: z.object({
    type: z.enum(['cohort', 'chain']),
    key: z.string(),
    label: z.string(),
    slug: z.string().nullable(),
    logoUrl: z.string().nullable(),
    overlapping: z.boolean(),
  }),
  scopes: z.object({
    cohorts: cohortScopeSchema.array(),
    chains: chainScopeSchema.array(),
  }),
  coverage: z.object({
    githubOrganizations: z.number().int().nonnegative(),
    chainMappedGithubOrganizations: z.number().int().nonnegative(),
    chainMappedPercent: z.number().nonnegative(),
    note: z.string(),
  }),
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
  corpus: z.object({
    indexedCommitRecords: z.number().int().nonnegative(),
    distinctCommitShas: z.number().int().nonnegative(),
    githubLinkedAuthors: z.number().int().nonnegative(),
    indexedRepositories: z.number().int().nonnegative(),
    indexedGithubOrganizations: z.number().int().nonnegative(),
    historicalInternalPeople: z.number().int().nonnegative(),
    currentInternalPeople: z.number().int().nonnegative(),
    verifiedInternalCommitRecords: z.number().int().nonnegative(),
    verifiedInternalMergeRecords: z.number().int().nonnegative(),
    historicalMaintainers: z.number().int().nonnegative(),
    currentMaintainers: z.number().int().nonnegative(),
    currentActiveLeads: z.number().int().nonnegative(),
  }),
  current: developerReportPointSchema.nullable(),
  history: developerReportPointSchema.array(),
  totals: z.object({
    repositoryCount: z.number().int().nonnegative(),
    commitCount: z.number().int().nonnegative(),
  }),
  repositoryHistory: z
    .object({
      period: z.string(),
      newRepositories: z.number().int().nonnegative(),
    })
    .array(),
  breakdown: z
    .object({
      key: z.enum(['internalPeople', 'maintainers', 'leads', 'established']),
      label: z.string(),
      current: z.number().int().nonnegative(),
      growth: growthSchema,
    })
    .array(),
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
export type DeveloperCohort = z.infer<typeof developerCohortSchema>;
export type DeveloperReport = z.infer<typeof developerReportSchema>;
export type DeveloperOrganization = DeveloperReport['organizations'][number];
export type DeveloperChain = DeveloperReport['scopes']['chains'][number];
