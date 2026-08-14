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

const report: DeveloperReport = {
  available: true,
  asOf: '2026-07-01T00:00:00.000Z',
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
    chains: [
      {
        chainId: '1',
        chainSlug: 'ethereum',
        chainName: 'Ethereum',
        logoUrl: null,
        contributors: 210,
        activePeople: 70,
        activeMaintainers: 15,
        activeLeads: 9,
        activeOrganizations: 10,
        repositoryCount: 300,
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
  repositoryHistory: [{ period: '2026-07-01', newRepositories: 12 }],
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
      contributors: 60,
      internalPeople: 25,
      maintainers: 10,
      leads: 6,
      joins: 6,
      exits: 2,
      commitCount: 5_000,
      mergeCount: 600,
      series: [
        {
          period: '2026-07-01',
          activeContributors: 60,
          activePeople: 25,
          activeMaintainers: 10,
          activeLeads: 6,
        },
      ],
    },
  ],
  movements: [],
};

afterEach(cleanup);

describe('DeveloperReportDashboard', () => {
  it('shows one canonical range and contributor population layers', () => {
    render(<DeveloperReportDashboard report={report} />);

    expect(
      screen.getByRole('heading', { name: 'The people building Crypto' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Contribution cadence')).toBeInTheDocument();
    expect(screen.getByText('Developer tenure')).toBeInTheDocument();
    expect(screen.getByText('Chain breadth')).toBeInTheDocument();
    expect(screen.getByText('New repositories')).toBeInTheDocument();
    expect(
      screen.getByText('Contributor and workforce layers over time'),
    ).toBeInTheDocument();
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
    expect(screen.getAllByText('Since inception').length).toBeGreaterThan(0);
    expect(screen.getAllByText('All contributors').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('Verified internal people').length,
    ).toBeGreaterThan(0);
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
                contributors: 899_369,
                activePeople: 11_552,
                activeMaintainers: 10_138,
                activeOrganizations: 2_069,
              },
            ],
          },
          current: point ? { ...point, activePeople: 11_552 } : null,
          summary: {
            ...report.summary,
            contributors: 899_369,
            internalPeople: 92_772,
            maintainers: 36_184,
            organizations: 7_022,
          },
        }}
      />,
    );

    expect(screen.queryByText('12K')).toBeNull();
    expect(
      screen.getByText('Contributor population layers'),
    ).toBeInTheDocument();
    expect(screen.getByText('Corpus coverage')).toBeInTheDocument();
    expect(screen.getAllByText('All contributors').length).toBeGreaterThan(0);
    expect(screen.getAllByText('899.4K').length).toBeGreaterThan(0);
    expect(screen.getByText('336M')).toBeInTheDocument();
    expect(screen.getByText('92.9M')).toBeInTheDocument();
    expect(screen.getByText('92.8K')).toBeInTheDocument();
    expect(screen.getByText('36.2K')).toBeInTheDocument();
    expect(screen.getByText('10.3% of contributors')).toBeInTheDocument();
    expect(screen.getByText('39.0% of internal people')).toBeInTheDocument();
  });

  it('preserves the report-wide interval in every scope link', () => {
    render(
      <DeveloperReportDashboard
        report={{
          ...report,
          range: {
            key: '1y',
            label: 'Last year',
            from: '2025-08-01',
            to: '2026-07-01',
          },
        }}
      />,
    );

    expect(screen.getByRole('link', { name: 'Ethereum' })).toHaveAttribute(
      'href',
      '/developers/chains/ethereum?range=1y',
    );
    expect(screen.getByRole('link', { name: '3 years' })).toHaveAttribute(
      'href',
      '/developers?cohort=crypto&range=3y',
    );
  });
});
