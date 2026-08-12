import { z } from 'zod';

export const jobMarketSalarySchema = z.object({
  medianMonthlyUsd: z.number().nullable(),
  meanMonthlyUsd: z.number().nullable(),
  p25MonthlyUsd: z.number().nullable(),
  p75MonthlyUsd: z.number().nullable(),
  sampleCount: z.number().int().nonnegative(),
  coverage: z.number().min(0).max(1),
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
});

export const jobMarketTickerSchema = z.object({
  kind: z.string(),
  slug: z.string(),
  label: z.string(),
  current: jobMarketPointSchema,
  momentum: jobMarketMomentumSchema,
  eligibleMover: z.boolean(),
});

export const pillarMarketSchema = z.object({
  asOf: z.string(),
  pillar: z.object({
    kind: z.string(),
    slug: z.string(),
    label: z.string(),
  }),
  current: jobMarketPointSchema,
  momentum: jobMarketMomentumSchema,
  history: jobMarketPointSchema.array(),
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

export type JobMarketSalary = z.infer<typeof jobMarketSalarySchema>;
export type JobMarketPoint = z.infer<typeof jobMarketPointSchema>;
export type JobMarketMomentum = z.infer<typeof jobMarketMomentumSchema>;
export type JobMarketTicker = z.infer<typeof jobMarketTickerSchema>;
export type PillarMarket = z.infer<typeof pillarMarketSchema>;
export type JobMarketOverview = z.infer<typeof jobMarketOverviewSchema>;
