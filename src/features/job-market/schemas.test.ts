import { describe, expect, it } from 'vitest';

import { jobMarketCompensationSchema } from './schemas';

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
});
