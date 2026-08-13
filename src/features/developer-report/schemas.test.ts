import { describe, expect, it } from 'vitest';

import { developerReportSchema } from './schemas';

describe('developerReportSchema', () => {
  it('accepts a complete internal-developer report and rejects external populations', () => {
    const report = {
      available: true,
      asOf: '2026-08-01',
      completeThrough: '2026-07-01',
      methodologyVersion: 'developer-report-v1',
      population: {
        label: 'Verified internal contributors',
        definition: 'Repeated recorded write authority',
        excludes: ['external contributors', 'bots', 'banned organizations'],
      },
      current: {
        period: '2026-07-01',
        activePeople: 100,
        activeMaintainers: 20,
        activeLeads: 12,
        activeOrganizations: 15,
        joins: 8,
        exits: 4,
        returns: 2,
        movements: 3,
        activityCount: 1_000,
        commitCount: 700,
        mergeCount: 100,
        oneDayPeople: 20,
        regularPeople: 50,
        sustainedPeople: 30,
        newPeople: 10,
        establishedPeople: 60,
        longTenuredPeople: 30,
      },
      history: [],
      retention: [],
      maintainerLeverage: {
        period: '2026-07-01',
        maintainerCount: 20,
        mergedPrCount: 100,
        medianAuthorsSupported: 3,
        p25AuthorsSupported: 1,
        p75AuthorsSupported: 6,
      },
      organizations: [],
      movements: [],
    } as const;

    expect(developerReportSchema.safeParse(report).success).toBe(true);
    expect(
      developerReportSchema.safeParse({
        ...report,
        population: { ...report.population, excludes: [] },
      }).success,
    ).toBe(false);
  });
});
