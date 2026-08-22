import { describe, expect, it } from 'vitest';

import {
  jobMarketCompensationSchema,
  jobMarketTopPayingSchema,
} from './schemas';

describe('job-market schemas', () => {
  it('accepts cached compensation created before opportunity counts existed', () => {
    const parsed = jobMarketCompensationSchema.parse({
      segment: 'local',
      regionSlug: 'europe',
      regionLabel: 'Europe',
      medianMonthlyUsd: 9000,
      p25MonthlyUsd: 7000,
      p75MonthlyUsd: 11000,
      adjustedPremiumPercent: null,
      sampleCount: 20,
      employerCount: 10,
      onsiteCount: 12,
      hybridCount: 8,
      remoteCount: 0,
      evidenceLevel: 'strong',
      reliable: true,
    });

    expect(parsed).toMatchObject({
      regionType: 'continent',
      countryCode: null,
      activeJobs: 0,
      hiringCompanies: 0,
      activeOnsiteJobs: 0,
      activeHybridJobs: 0,
      activeRemoteJobs: 0,
    });
  });

  it('accepts a sparse top-pay cohort without suppressing its estimate', () => {
    const parsed = jobMarketTopPayingSchema.parse({
      asOf: '2026-08-12',
      methodologyVersion: 'market-top-pay-v1',
      scope: {
        classification: 'market',
        classificationLabel: 'Crypto Job Market',
        segment: 'local',
        regionSlug: 'amsterdam',
        regionLabel: 'Amsterdam',
        regionType: 'city',
        filter: { paramKey: 'cities', value: 'amsterdam' },
      },
      availableRegions: [],
      openJobsInScope: 10,
      salaryJobCount: 1,
      salaryCoveragePercent: 10,
      topDecileThresholdMonthlyUsd: 8_500,
      topDecileJobCount: 1,
      medianTopDecileMonthlyUsd: 8_500,
      breakdowns: {
        classifications: [],
        seniorities: [],
        tags: [],
      },
      jobs: [],
    });

    expect(parsed.topDecileThresholdMonthlyUsd).toBe(8_500);
    expect(parsed.salaryJobCount).toBe(1);
  });
});
