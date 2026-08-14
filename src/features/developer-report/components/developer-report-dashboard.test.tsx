// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/job-market/components/flint-echart', () => ({
  FlintEChart: ({ ariaLabel }: { ariaLabel: string }) => (
    <div role='img' aria-label={ariaLabel} />
  ),
}));

import type { DeveloperReport } from '../schemas';
import { DeveloperReportDashboard } from './developer-report-dashboard';

const point: DeveloperReport['current'] = {
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

const report: DeveloperReport = {
  available: true,
  asOf: '2026-07-01T00:00:00.000Z',
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
    chains: [
      {
        chainId: '1',
        chainSlug: 'ethereum',
        chainName: 'Ethereum',
        logoUrl: null,
        activePeople: 70,
        activeMaintainers: 15,
        activeLeads: 9,
        establishedPeople: 40,
        activeOrganizations: 10,
        repositoryCount: 300,
        growth: { oneYear: 12.5, twoYear: null, threeYear: null },
      },
    ],
  },
  coverage: {
    githubOrganizations: 100,
    chainMappedGithubOrganizations: 75,
    chainMappedPercent: 75,
    note: 'Chain cohorts overlap.',
  },
  population: {
    label: 'Verified internal contributors',
    definition: 'Canonical internal people only.',
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
  history: point ? [point] : [],
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
  organizations: [
    {
      organizationKey: 'uniswap',
      organizationId: '1',
      organizationName: 'Uniswap',
      organizationSlug: 'uniswap',
      cohort: 'crypto',
      logoUrl: null,
      layoutX: 0.25,
      layoutY: -0.5,
      communityId: 7,
      activePeople: 25,
      activeMaintainers: 10,
      activeLeads: 6,
      establishedPeople: 18,
      growth: { oneYear: 8, twoYear: null, threeYear: null },
      joins12m: 6,
      exits12m: 2,
      netTeamChange12m: 4,
      commitCount12m: 5_000,
      mergeCount12m: 600,
      series: [{ period: '2026-07-01', activePeople: 25 }],
    },
  ],
  movements: [],
};

afterEach(cleanup);

describe('DeveloperReportDashboard', () => {
  it('shows actionable v2 developer signals without retired sections', () => {
    render(<DeveloperReportDashboard report={report} />);

    expect(
      screen.getByRole('heading', { name: 'The people building Crypto' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Contribution cadence')).toBeInTheDocument();
    expect(screen.getByText('Developer tenure')).toBeInTheDocument();
    expect(screen.getByText('Chain breadth')).toBeInTheDocument();
    expect(screen.getByText('New repositories')).toBeInTheDocument();
    expect(screen.getByText('Teams growing and shrinking')).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: 'Organization bubble timeline for Crypto, July 2026',
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Retention by starting cohort')).toBeNull();
    expect(screen.queryByText('Maintainer leverage')).toBeNull();
    expect(screen.getByRole('link', { name: 'Ethereum' })).toHaveAttribute(
      'href',
      '/developers/chains/ethereum',
    );
    expect(screen.getByText('Uniswap')).toBeInTheDocument();
  });

  it('shows the reconciled all-sector population without rounding it to 12K', () => {
    render(
      <DeveloperReportDashboard
        report={{
          ...report,
          scope: { ...report.scope, key: 'all', label: 'All sectors' },
          scopes: {
            ...report.scopes,
            cohorts: [
              {
                cohort: 'all',
                label: 'All sectors',
                activePeople: 11_552,
                activeMaintainers: 10_138,
                activeOrganizations: 2_069,
              },
            ],
          },
          current: point ? { ...point, activePeople: 11_552 } : null,
        }}
      />,
    );

    expect(screen.getAllByText('11.6K')).toHaveLength(2);
    expect(screen.queryByText('12K')).toBeNull();
    expect(screen.getByText('Indexed GitHub coverage')).toBeInTheDocument();
    expect(screen.getByText('Verified internal workforce')).toBeInTheDocument();
    expect(screen.getByText('336M')).toBeInTheDocument();
    expect(screen.getByText('92.9M')).toBeInTheDocument();
    expect(screen.getByText('92.8K')).toBeInTheDocument();
    expect(screen.getByText('16K')).toBeInTheDocument();
  });
});
