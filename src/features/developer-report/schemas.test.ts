import { describe, expect, it } from 'vitest';

import { developerReportSchema } from './schemas';

const point = {
  period: '2026-07-01',
  allContributors: 300,
  activeDevelopers: 200,
  internalDevelopers: 100,
  canonicalInternalPeople: 98,
  activeMaintainers: 20,
  activeLeads: 12,
  activeOrganizations: 15,
  activeRepositories: 80,
  rawIndexedCommitRecords: 1_000,
  commitsWritten: 700,
  creditedOriginalCommits: 700,
  inheritedForkCommits: 120,
  inheritedUnattributedCopyCommits: 10,
  fullTimeDevelopers: 60,
  partTimeDevelopers: 90,
  oneTimeDevelopers: 50,
  newcomerDevelopers: 30,
  emergingDevelopers: 70,
  establishedDevelopers: 100,
  newDevelopers: 18,
  newRepositories: 12,
  newForkRepositories: 4,
  newUnattributedCopyRepositories: 1,
  internalDeveloperShare: 0.5,
};

const scope = {
  slug: 'robotics',
  label: 'Robotics',
  logoUrl: null,
  allContributors: 300,
  activeDevelopers: 200,
  internalDevelopers: 100,
  activeMaintainers: 20,
  activeLeads: 12,
  activeOrganizations: 15,
  activeRepositories: 80,
};

describe('developerReportSchema', () => {
  it('accepts dynamic verticals and the canonical corrected contract', () => {
    const report = {
      available: true,
      asOf: '2026-08-01',
      completeThrough: '2026-07-01',
      methodologyVersion: 'developer-report-v2',
      range: {
        key: '6m',
        label: 'Last 6 months',
        from: '2026-02-01',
        to: '2026-07-01',
      },
      summary: {
        allTimeIngestedCommitRows: 4_800,
        reportCommitRecords: 1_000,
        rawIndexedCommitRecords: 1_000,
        commitsWritten: 700,
        creditedOriginalCommits: 700,
        inheritedForkCommits: 120,
        inheritedUnattributedCopyCommits: 10,
        allContributors: 300,
        activeDevelopers: 200,
        internalDevelopers: 100,
        canonicalInternalPeople: 98,
        maintainers: 20,
        activeLeads: 12,
        organizations: 15,
        activeRepositories: 80,
        newDevelopers: 18,
        newRepositories: 12,
        newForkRepositories: 4,
        newUnattributedCopyRepositories: 1,
        internalDeveloperShare: 0.5,
      },
      scope: {
        type: 'vertical_chain',
        label: 'Robotics · Ethereum',
        vertical: 'robotics',
        chain: 'ethereum',
        logoUrl: null,
        verticalsAreExclusive: true,
        chainsOverlap: true,
      },
      scopes: {
        verticals: [{ ...scope, exclusive: true, history: [point] }],
        chains: [{ ...scope, slug: 'ethereum', label: 'Ethereum' }],
      },
      coverage: {
        organizationsTotal: 20,
        categorizedOrganizations: 15,
        unclassifiedOrganizations: 5,
        organizationPercent: 75,
        developersTotal: 250,
        categorizedDevelopers: 200,
        unclassifiedDevelopers: 50,
        developerPercent: 80,
        note: 'Verticals are exclusive; chains overlap.',
      },
      population: {
        label: 'Original-work developers',
        definition: 'Numeric GitHub authors of credited originals.',
        excludes: ['bots', 'banned organizations', 'copied history'],
      },
      current: point,
      history: [point],
      top: {
        verticals: [scope],
        chains: [],
        organizations: [],
      },
      organizations: [],
    } as const;

    expect(developerReportSchema.safeParse(report).success).toBe(true);
    expect(
      developerReportSchema.safeParse({
        ...report,
        scope: { ...report.scope, vertical: 'unsafe slug!' },
      }).success,
    ).toBe(false);
  });

  it('rejects the retired cohort contract', () => {
    expect(
      developerReportSchema.safeParse({
        methodologyVersion: 'developer-report',
        cohort: 'crypto',
        retention: [],
      }).success,
    ).toBe(false);
  });
});
