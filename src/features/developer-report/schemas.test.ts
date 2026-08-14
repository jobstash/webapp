import { describe, expect, it } from 'vitest';

import { developerReportSchema } from './schemas';

const point = {
  period: '2026-07-01',
  activeContributors: 300,
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
  it('accepts the canonical report contract and rejects unsafe populations', () => {
    const report = {
      available: true,
      asOf: '2026-08-01',
      completeThrough: '2026-07-01',
      methodologyVersion: 'developer-report',
      range: {
        key: 'all',
        label: 'Since inception',
        from: '2008-01-01',
        to: '2026-07-01',
      },
      summary: {
        contributors: 300,
        internalPeople: 100,
        maintainers: 20,
        activeLeads: 12,
        organizations: 15,
        repositoryCount: 400,
        indexedCommitRecords: 10_000,
        internalCommitRecords: 700,
        mergeRecords: 100,
      },
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
            contributors: 300,
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
      corpus: {
        indexedCommitRecords: 335_955_320,
        distinctCommitShas: 92_889_595,
        githubLinkedAuthors: 899_369,
        indexedRepositories: 241_692,
        indexedGithubOrganizations: 7_022,
        historicalInternalPeople: 92_772,
        currentInternalPeople: 15_965,
        verifiedInternalCommitRecords: 25_656_248,
        verifiedInternalMergeRecords: 7_443_234,
        historicalMaintainers: 36_184,
        currentMaintainers: 8_075,
        currentActiveLeads: 6_776,
      },
      current: point,
      history: [point],
      repositoryHistory: [{ period: '2026-07-01', newRepositories: 12 }],
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
        methodologyVersion: 'obsolete-contract',
        retention: [],
        maintainerLeverage: {},
      }).success,
    ).toBe(false);
  });
});
