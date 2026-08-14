import { z } from 'zod';

export const developerVerticalSchema = z
  .string()
  .regex(/^[a-z0-9][a-z0-9_-]{0,119}$/);

export const developerReportRangeSchema = z.enum([
  '3m',
  '6m',
  '1y',
  '3y',
  'max',
]);

export const developerReportPointSchema = z.object({
  period: z.string(),
  allContributors: z.number().int().nonnegative(),
  activeDevelopers: z.number().int().nonnegative(),
  internalDevelopers: z.number().int().nonnegative(),
  canonicalInternalPeople: z.number().int().nonnegative(),
  activeMaintainers: z.number().int().nonnegative(),
  activeLeads: z.number().int().nonnegative(),
  activeOrganizations: z.number().int().nonnegative(),
  activeRepositories: z.number().int().nonnegative(),
  rawIndexedCommitRecords: z.number().int().nonnegative(),
  creditedOriginalCommits: z.number().int().nonnegative(),
  fullTimeDevelopers: z.number().int().nonnegative(),
  partTimeDevelopers: z.number().int().nonnegative(),
  oneTimeDevelopers: z.number().int().nonnegative(),
  newcomerDevelopers: z.number().int().nonnegative(),
  emergingDevelopers: z.number().int().nonnegative(),
  establishedDevelopers: z.number().int().nonnegative(),
  newDevelopers: z.number().int().nonnegative(),
  newRepositories: z.number().int().nonnegative(),
  internalDeveloperShare: z.number().nonnegative(),
});

const scopeSummarySchema = z.object({
  slug: developerVerticalSchema,
  label: z.string(),
  logoUrl: z.string().nullable(),
  allContributors: z.number().int().nonnegative(),
  activeDevelopers: z.number().int().nonnegative(),
  internalDevelopers: z.number().int().nonnegative(),
  activeMaintainers: z.number().int().nonnegative(),
  activeLeads: z.number().int().nonnegative(),
  activeOrganizations: z.number().int().nonnegative(),
  activeRepositories: z.number().int().nonnegative(),
});

const verticalSummarySchema = scopeSummarySchema.extend({
  exclusive: z.literal(true),
  history: developerReportPointSchema.array(),
});

const developerOrganizationSchema = z.object({
  organizationKey: z.string(),
  organizationId: z.string().nullable(),
  organizationName: z.string(),
  organizationSlug: z.string(),
  vertical: z.string(),
  logoUrl: z.string().nullable(),
  layoutX: z.number().nullable(),
  layoutY: z.number().nullable(),
  communityId: z.number().int().nonnegative().nullable(),
  allContributors: z.number().int().nonnegative(),
  activeDevelopers: z.number().int().nonnegative(),
  internalDevelopers: z.number().int().nonnegative(),
  canonicalInternalPeople: z.number().int().nonnegative(),
  maintainers: z.number().int().nonnegative(),
  leads: z.number().int().nonnegative(),
  creditedOriginalCommits: z.number().int().nonnegative(),
  activeRepositories: z.number().int().nonnegative(),
  series: z
    .object({
      period: z.string(),
      activeDevelopers: z.number().int().nonnegative(),
      internalDevelopers: z.number().int().nonnegative(),
      activeMaintainers: z.number().int().nonnegative(),
      activeLeads: z.number().int().nonnegative(),
    })
    .array(),
});

export const developerReportSchema = z.object({
  available: z.boolean(),
  asOf: z.string().nullable(),
  completeThrough: z.string().nullable(),
  methodologyVersion: z.literal('developer-report-v2'),
  range: z.object({
    key: developerReportRangeSchema,
    label: z.string(),
    from: z.string(),
    to: z.string(),
  }),
  summary: z.object({
    rawIndexedCommitRecords: z.number().int().nonnegative(),
    creditedOriginalCommits: z.number().int().nonnegative(),
    allContributors: z.number().int().nonnegative(),
    activeDevelopers: z.number().int().nonnegative(),
    internalDevelopers: z.number().int().nonnegative(),
    canonicalInternalPeople: z.number().int().nonnegative(),
    maintainers: z.number().int().nonnegative(),
    activeLeads: z.number().int().nonnegative(),
    organizations: z.number().int().nonnegative(),
    activeRepositories: z.number().int().nonnegative(),
    newDevelopers: z.number().int().nonnegative(),
    newRepositories: z.number().int().nonnegative(),
    internalDeveloperShare: z.number().nonnegative(),
  }),
  scope: z.object({
    type: z.enum(['overall', 'vertical', 'chain', 'vertical_chain']),
    label: z.string(),
    vertical: developerVerticalSchema.nullable(),
    chain: developerVerticalSchema.nullable(),
    logoUrl: z.string().nullable(),
    verticalsAreExclusive: z.literal(true),
    chainsOverlap: z.boolean(),
  }),
  scopes: z.object({
    verticals: verticalSummarySchema.array(),
    chains: scopeSummarySchema.array(),
  }),
  coverage: z.object({
    organizationsTotal: z.number().int().nonnegative(),
    categorizedOrganizations: z.number().int().nonnegative(),
    unclassifiedOrganizations: z.number().int().nonnegative(),
    organizationPercent: z.number().nonnegative(),
    developersTotal: z.number().int().nonnegative(),
    categorizedDevelopers: z.number().int().nonnegative(),
    unclassifiedDevelopers: z.number().int().nonnegative(),
    developerPercent: z.number().nonnegative(),
    note: z.string(),
  }),
  population: z.object({
    label: z.string(),
    definition: z.string(),
    excludes: z.string().array(),
  }),
  current: developerReportPointSchema.nullable(),
  history: developerReportPointSchema.array(),
  top: z.object({
    verticals: scopeSummarySchema.array(),
    chains: scopeSummarySchema.array(),
    organizations: z
      .object({
        organizationKey: z.string(),
        organizationName: z.string(),
        activeDevelopers: z.number().int().nonnegative(),
      })
      .array(),
  }),
  organizations: developerOrganizationSchema.array(),
});

export type DeveloperReportPoint = z.infer<typeof developerReportPointSchema>;
export type DeveloperReportRange = z.infer<typeof developerReportRangeSchema>;
export type DeveloperReport = z.infer<typeof developerReportSchema>;
export type DeveloperOrganization = DeveloperReport['organizations'][number];
export type DeveloperChain = DeveloperReport['scopes']['chains'][number];
