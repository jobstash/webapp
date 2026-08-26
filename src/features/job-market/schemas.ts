import { z } from 'zod';

export const jobMarketEvidenceLevelSchema = z.enum([
  'insufficient',
  'limited',
  'strong',
]);

export const jobMarketFilterSchema = z.object({
  paramKey: z.enum([
    'tags',
    'classifications',
    'commitments',
    'workModes',
    'organizations',
    'seniority',
    'investors',
    'fundingRounds',
    'fundingStages',
    'cities',
    'regions',
    'countries',
    'continents',
    'timezones',
    'collaborationHours',
  ]),
  value: z.string().min(1),
});

export const jobMarketSalarySchema = z.object({
  medianMonthlyUsd: z.number().nullable(),
  meanMonthlyUsd: z.number().nullable(),
  p25MonthlyUsd: z.number().nullable(),
  p75MonthlyUsd: z.number().nullable(),
  sampleCount: z.number().int().nonnegative(),
  coverage: z.number().min(0).max(1),
  evidenceLevel: jobMarketEvidenceLevelSchema,
  reliable: z.boolean(),
});

export const jobMarketPointSchema = z.object({
  date: z.string(),
  activeJobs: z.number().int().nonnegative(),
  hiringCompanies: z.number().int().nonnegative(),
  newJobs: z.number().int().nonnegative(),
  salary: jobMarketSalarySchema,
  provenance: z.enum(['reconstructed', 'snapshot']),
  sampledAt: z.string(),
});

export const jobMarketMomentumSchema = z.object({
  periodDays: z.literal(7),
  currentJobs: z.number().int().nonnegative(),
  previousJobs: z.number().int().nonnegative(),
  absoluteChange: z.number().int(),
  percentChange: z.number().nullable(),
  direction: z.enum(['up', 'down', 'flat', 'new', 'insufficient']),
  marketRelativeScore: z.number().nullable(),
  activeJobsChange: z.number().nullable(),
  hiringCompaniesChange: z.number().nullable(),
});

const jobMarketChangeMetricSchema = z.object({
  current: z.number().nonnegative(),
  baseline: z.number().nonnegative(),
  absoluteChange: z.number(),
  percentChange: z.number().nullable(),
  direction: z.enum(['up', 'down', 'flat', 'new', 'insufficient']),
});

export const jobMarketActivitySchema = z.object({
  newPostings: jobMarketChangeMetricSchema.extend({
    currentWindowDays: z.literal(7),
    baselineWindowDays: z.literal(7),
  }),
  openInventory: jobMarketChangeMetricSchema.extend({
    currentWindowDays: z.literal(7),
    baselineWindowDays: z.literal(28),
  }),
  hiringEmployers: jobMarketChangeMetricSchema.extend({
    currentWindowDays: z.literal(7),
    baselineWindowDays: z.literal(28),
  }),
  marketComparison: z.object({
    openInventoryPercentagePoints: z.number().nullable(),
    hiringEmployersPercentagePoints: z.number().nullable(),
    newPostingsPercentagePoints: z.number().nullable(),
  }),
});

export const jobMarketCompensationSchema = z.object({
  segment: z.enum(['remote', 'local']),
  regionSlug: z.string(),
  regionLabel: z.string(),
  regionType: z
    .enum(['remote', 'aggregate', 'continent', 'country', 'region', 'city'])
    .default('continent'),
  filter: jobMarketFilterSchema.nullable().default(null),
  countryCode: z.string().nullable().default(null),
  medianMonthlyUsd: z.number().nullable(),
  p25MonthlyUsd: z.number().nullable(),
  p75MonthlyUsd: z.number().nullable(),
  adjustedPremiumPercent: z.number().nullable(),
  sampleCount: z.number().int().nonnegative(),
  employerCount: z.number().int().nonnegative(),
  onsiteCount: z.number().int().nonnegative(),
  hybridCount: z.number().int().nonnegative(),
  remoteCount: z.number().int().nonnegative(),
  activeJobs: z.number().int().nonnegative().default(0),
  hiringCompanies: z.number().int().nonnegative().default(0),
  activeOnsiteJobs: z.number().int().nonnegative().default(0),
  activeHybridJobs: z.number().int().nonnegative().default(0),
  activeRemoteJobs: z.number().int().nonnegative().default(0),
  evidenceLevel: jobMarketEvidenceLevelSchema,
  reliable: z.boolean(),
});

export const jobMarketSkillSignalSchema = z.object({
  asOf: z.string(),
  segment: z.enum(['remote', 'local']),
  status: z.enum(['rising', 'falling', 'stable', 'insufficient']),
  currentMedianMonthlyUsd: z.number().nullable(),
  baselineMedianMonthlyUsd: z.number().nullable(),
  rawChangePercent: z.number().nullable(),
  adjustedChangePercent: z.number().nullable(),
  confidenceLowPercent: z.number().nullable(),
  confidenceHighPercent: z.number().nullable(),
  qValue: z.number().nullable(),
  recentJobCount: z.number().int().nonnegative(),
  baselineJobCount: z.number().int().nonnegative(),
  recentEmployerCount: z.number().int().nonnegative(),
  baselineEmployerCount: z.number().int().nonnegative(),
  signalSince: z.string().nullable(),
});

export const jobMarketTickerSchema = z.object({
  kind: z.string(),
  slug: z.string(),
  label: z.string(),
  current: jobMarketPointSchema,
  history: jobMarketPointSchema.array().optional(),
  momentum: jobMarketMomentumSchema,
  activity: jobMarketActivitySchema,
  eligibleMover: z.boolean(),
});

export const pillarMarketSchema = z.object({
  asOf: z.string(),
  pillar: z.object({
    kind: z.string(),
    slug: z.string(),
    label: z.string(),
    filter: jobMarketFilterSchema.nullable(),
  }),
  current: jobMarketPointSchema,
  momentum: jobMarketMomentumSchema,
  history: jobMarketPointSchema.array(),
  compensation: jobMarketCompensationSchema.array(),
  skillSignals: jobMarketSkillSignalSchema.array(),
});

export const jobMarketOverviewSchema = z.object({
  asOf: z.string(),
  market: jobMarketTickerSchema,
  classifications: jobMarketTickerSchema.array(),
  movers: z.object({
    bullish: jobMarketTickerSchema.array(),
    cooling: jobMarketTickerSchema.array(),
  }),
});

export const jobMarketStateSchema = jobMarketOverviewSchema.extend({
  completeThrough: z.string(),
  methodologyVersion: z.literal('market-state-v3'),
  selectedClassification: z.string(),
  selectedClassificationLabel: z.string(),
  range: z.enum(['90', '365', 'max']),
  geography: jobMarketCompensationSchema.array(),
  compensationBands: z
    .object({
      segment: z.enum(['remote', 'local']),
      senioritySlug: z.string(),
      seniorityLabel: z.string(),
      medianMonthlyUsd: z.number().nullable(),
      p25MonthlyUsd: z.number().nullable(),
      p75MonthlyUsd: z.number().nullable(),
      sampleCount: z.number().int().nonnegative(),
      employerCount: z.number().int().nonnegative(),
      reliable: z.boolean(),
    })
    .array(),
});

const jobMarketTopPayingBreakdownSchema = z.object({
  slug: z.string(),
  label: z.string(),
  jobCount: z.number().int().nonnegative(),
  sharePercent: z.number().min(0).max(100),
  medianMonthlyUsd: z.number().nonnegative(),
});

export const jobMarketTopPayingSchema = z.object({
  asOf: z.string(),
  methodologyVersion: z.enum(['market-top-pay-v1', 'market-top-pay-v2']),
  scope: z.object({
    classification: z.string(),
    classificationLabel: z.string(),
    segment: z.enum(['remote', 'local']),
    regionSlug: z.string(),
    regionLabel: z.string(),
    regionType: z.enum([
      'remote',
      'aggregate',
      'continent',
      'country',
      'region',
      'city',
    ]),
    filter: jobMarketFilterSchema.nullable(),
  }),
  availableRegions: z
    .object({
      regionSlug: z.string(),
      regionLabel: z.string(),
      regionType: z.enum([
        'aggregate',
        'continent',
        'country',
        'region',
        'city',
      ]),
      activeJobs: z.number().int().nonnegative(),
      salarySampleCount: z.number().int().nonnegative(),
    })
    .array(),
  openJobsInScope: z.number().int().nonnegative(),
  salaryJobCount: z.number().int().nonnegative(),
  salaryCoveragePercent: z.number().min(0).max(100),
  topDecileThresholdMonthlyUsd: z.number().nonnegative().nullable(),
  topDecileJobCount: z.number().int().nonnegative(),
  medianTopDecileMonthlyUsd: z.number().nonnegative().nullable(),
  breakdowns: z.object({
    classifications: jobMarketTopPayingBreakdownSchema.array(),
    seniorities: jobMarketTopPayingBreakdownSchema.array(),
    tags: jobMarketTopPayingBreakdownSchema.array(),
  }),
  jobs: z
    .object({
      id: z.string(),
      shortUuid: z.string(),
      title: z.string(),
      href: z.string().startsWith('/'),
      organizationName: z.string().nullable(),
      organizationLogoUrl: z.string().nullable(),
      classificationSlug: z.string(),
      classificationLabel: z.string(),
      senioritySlug: z.string().nullable(),
      seniorityLabel: z.string().nullable(),
      location: z.string().nullable(),
      workModes: z.string().array(),
      publishedAt: z.string().nullable(),
      salaryMonthlyUsd: z.number().nonnegative(),
      tags: z.object({ slug: z.string(), label: z.string() }).array(),
    })
    .array(),
});

export const jobMarketSkillSummarySchema = z.object({
  slug: z.string(),
  label: z.string(),
  segment: z.enum(['remote', 'local']),
  current: jobMarketCompensationSchema,
  signal: jobMarketSkillSignalSchema.nullable(),
  momentum: jobMarketMomentumSchema,
  activeJobs: z.number().int().nonnegative(),
  hiringCompanies: z.number().int().nonnegative(),
  openJobShare: z.number().min(0).max(100),
  strongBreakout: z.boolean(),
});

export const jobMarketSkillListSchema = z.object({
  asOf: z.string(),
  completeThrough: z.string(),
  methodologyVersion: z.literal('market-state-v3'),
  classification: z.string(),
  classificationLabel: z.string(),
  segment: z.enum(['remote', 'local']),
  sort: z.enum(['breakout', 'repricing', 'salary', 'demand', 'cooling']),
  query: z.string(),
  skills: jobMarketSkillSummarySchema.array(),
});

export const jobMarketSkillWeeklyPointSchema = z.object({
  weekStart: z.string(),
  segment: z.enum(['remote', 'local']),
  regionSlug: z.string(),
  regionLabel: z.string(),
  medianMonthlyUsd: z.number().nullable(),
  p25MonthlyUsd: z.number().nullable(),
  p75MonthlyUsd: z.number().nullable(),
  adjustedPremiumPercent: z.number().nullable(),
  sampleCount: z.number().int().nonnegative(),
  employerCount: z.number().int().nonnegative(),
  onsiteCount: z.number().int().nonnegative(),
  hybridCount: z.number().int().nonnegative(),
  remoteCount: z.number().int().nonnegative(),
  reliable: z.boolean(),
});

export const jobMarketSkillDetailSchema = z.object({
  asOf: z.string(),
  completeThrough: z.string(),
  methodologyVersion: z.literal('market-state-v2'),
  skill: z.object({ slug: z.string(), label: z.string() }),
  signals: jobMarketSkillSignalSchema.array(),
  compensation: jobMarketCompensationSchema.array(),
  history: jobMarketSkillWeeklyPointSchema.array(),
});

export type JobMarketSalary = z.infer<typeof jobMarketSalarySchema>;
export type JobMarketPoint = z.infer<typeof jobMarketPointSchema>;
export type JobMarketMomentum = z.infer<typeof jobMarketMomentumSchema>;
export type JobMarketActivity = z.infer<typeof jobMarketActivitySchema>;
export type JobMarketTicker = z.infer<typeof jobMarketTickerSchema>;
export type PillarMarket = z.infer<typeof pillarMarketSchema>;
export type JobMarketOverview = z.infer<typeof jobMarketOverviewSchema>;
export type JobMarketCompensation = z.infer<typeof jobMarketCompensationSchema>;
export type JobMarketSkillSignal = z.infer<typeof jobMarketSkillSignalSchema>;
export type JobMarketState = z.infer<typeof jobMarketStateSchema>;
export type JobMarketTopPaying = z.infer<typeof jobMarketTopPayingSchema>;
export type JobMarketTopPayingBreakdown =
  JobMarketTopPaying['breakdowns']['classifications'][number];
export type JobMarketCompensationBand =
  JobMarketState['compensationBands'][number];
export type JobMarketSkillSummary = z.infer<typeof jobMarketSkillSummarySchema>;
export type JobMarketSkillList = z.infer<typeof jobMarketSkillListSchema>;
export type JobMarketSkillDetail = z.infer<typeof jobMarketSkillDetailSchema>;
export type JobMarketSkillWeeklyPoint = z.infer<
  typeof jobMarketSkillWeeklyPointSchema
>;
