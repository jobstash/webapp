import { describe, expect, it } from 'vitest';

import { developerReportSchema } from './schemas';

const point = {
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
  singleChainPeople: 40,
  multiChainPeople: 35,
  unmappedChainPeople: 25,
  newcomerPeople: 10,
  emergingPeople: 30,
  establishedPeople: 60,
};

describe('developerReportSchema', () => {
  it('accepts v2 internal-developer data and rejects external populations', () => {
    const report = {
      available: true,
      asOf: '2026-08-01',
      completeThrough: '2026-07-01',
      methodologyVersion: 'developer-report-v2',
      scope: {
        type: 'cohort',
        key: 'crypto',
        label: 'Crypto',
        slug: null,
        logoUrl: null,
        overlapping: false,
      },
      scopes: {
        cohorts: [
          {
            cohort: 'crypto',
            label: 'Crypto',
            activePeople: 100,
            activeMaintainers: 20,
            activeOrganizations: 15,
          },
        ],
        chains: [],
      },
      coverage: {
        githubOrganizations: 100,
        chainMappedGithubOrganizations: 75,
        chainMappedPercent: 75,
        note: 'Chain cohorts overlap.',
      },
      population: {
        label: 'Verified internal contributors',
        definition: 'Repeated recorded write authority',
        excludes: ['external contributors', 'bots', 'banned organizations'],
      },
      current: point,
      history: [point],
      totals: { repositoryCount: 400, commitCount: 10_000 },
      repositoryHistory: [{ period: '2026-07-01', newRepositories: 12 }],
      breakdown: [
        {
          key: 'internalPeople',
          label: 'Internal people',
          current: 100,
          growth: { oneYear: 10, twoYear: null, threeYear: null },
        },
      ],
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

  it('does not accept the retired retention and maintainer-leverage payload', () => {
    expect(
      developerReportSchema.safeParse({
        methodologyVersion: 'developer-report-v1',
        retention: [],
        maintainerLeverage: {},
      }).success,
    ).toBe(false);
  });
});
