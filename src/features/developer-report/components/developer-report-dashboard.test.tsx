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

const point: NonNullable<DeveloperReport['current']> = {
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
  slug: 'crypto',
  label: 'Crypto',
  logoUrl: null,
  allContributors: 300,
  activeDevelopers: 200,
  internalDevelopers: 100,
  activeMaintainers: 20,
  activeLeads: 12,
  activeOrganizations: 15,
  activeRepositories: 80,
};

const report: DeveloperReport = {
  available: true,
  asOf: '2026-07-01T00:00:00.000Z',
  completeThrough: '2026-07-01',
  methodologyVersion: 'developer-report-v2',
  range: {
    key: 'max',
    label: 'Since inception',
    from: '2008-01-01',
    to: '2026-07-01',
  },
  summary: {
    allTimeIngestedCommitRows: 48_000,
    reportCommitRecords: 10_000,
    rawIndexedCommitRecords: 10_000,
    commitsWritten: 7_000,
    creditedOriginalCommits: 7_000,
    inheritedForkCommits: 1_200,
    inheritedUnattributedCopyCommits: 100,
    allContributors: 300,
    activeDevelopers: 200,
    internalDevelopers: 100,
    canonicalInternalPeople: 98,
    maintainers: 20,
    activeLeads: 12,
    organizations: 15,
    activeRepositories: 400,
    newDevelopers: 18,
    newRepositories: 12,
    newForkRepositories: 4,
    newUnattributedCopyRepositories: 1,
    internalDeveloperShare: 0.5,
  },
  scope: {
    type: 'vertical',
    label: 'Crypto',
    vertical: 'crypto',
    chain: null,
    logoUrl: null,
    verticalsAreExclusive: true,
    chainsOverlap: false,
  },
  scopes: {
    overall: {
      ...scope,
      slug: 'overall',
      label: 'Overall',
      allContributors: 360,
      activeDevelopers: 250,
    },
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
    definition: 'Numeric GitHub authors of provenance-approved originals.',
    excludes: ['bots', 'banned organizations', 'copied history'],
  },
  current: point,
  history: [point],
  top: {
    verticals: [scope],
    chains: [{ ...scope, slug: 'ethereum', label: 'Ethereum' }],
    organizations: [
      {
        organizationKey: 'jobstash:uniswap',
        organizationName: 'Uniswap',
        activeDevelopers: 60,
      },
    ],
  },
  organizations: [
    {
      organizationKey: 'jobstash:uniswap',
      organizationId: '1',
      organizationName: 'Uniswap',
      organizationSlug: 'uniswap',
      vertical: 'crypto',
      logoUrl: null,
      layoutX: 250,
      layoutY: -500,
      communityId: 7,
      allContributors: 80,
      activeDevelopers: 60,
      internalDevelopers: 25,
      canonicalInternalPeople: 24,
      maintainers: 10,
      leads: 6,
      creditedOriginalCommits: 5_000,
      activeRepositories: 40,
      series: [
        {
          period: '2026-07-01',
          activeDevelopers: 60,
          internalDevelopers: 25,
          activeMaintainers: 10,
          activeLeads: 6,
        },
      ],
    },
  ],
};

afterEach(cleanup);

describe('DeveloperReportDashboard', () => {
  it('renders corrected activity, cadence, tenure, growth, and atlas sections', () => {
    render(<DeveloperReportDashboard report={report} />);

    expect(screen.getByRole('heading', { name: 'Crypto' })).toBeInTheDocument();
    expect(screen.getByText('Active developers over time')).toBeInTheDocument();
    expect(
      screen.getByText('Active developers by contribution frequency'),
    ).toBeInTheDocument();
    expect(screen.getByText('Active developers by tenure')).toBeInTheDocument();
    expect(
      screen.getByText('New repositories and GitHub forks'),
    ).toBeInTheDocument();
    expect(screen.getByText('Commits written each month')).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: 'Organization bubble timeline for Crypto, July 2026',
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Retention by starting cohort')).toBeNull();
    expect(screen.queryByText('Maintainer leverage')).toBeNull();
    expect(screen.getAllByText('Commits written').length).toBeGreaterThan(0);
    expect(screen.getByText('Raw commit rows ingested')).toBeInTheDocument();
    expect(
      screen.getByText(
        /including repeat crawls.*unique records match this report/,
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText('Commits scanned')).toBeNull();
    expect(screen.getAllByText('Active developers').length).toBeGreaterThan(0);
    expect(
      screen.getByText('Developers who wrote at least one new commit'),
    ).toBeInTheDocument();
    expect(screen.queryByText(/original code/i)).toBeNull();
    expect(screen.queryByText(/unattributed cop/i)).toBeNull();
    expect(
      screen.getByText(
        /Developers are counted in a month when they write a new commit/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Raw ingestion includes repeat crawl snapshots/),
    ).toBeInTheDocument();
    expect(screen.queryByText(/provenance-approved/i)).toBeNull();
    expect(screen.queryByText(/organization-gated/i)).toBeNull();
    expect(screen.getByText('Uniswap')).toBeInTheDocument();
  });

  it('preserves vertical and range in navigable chain and range links', () => {
    render(<DeveloperReportDashboard report={report} />);

    expect(
      screen.getAllByRole('link', { name: /Ethereum/ })[0],
    ).toHaveAttribute('href', '/developers/chains/ethereum?vertical=crypto');
    expect(screen.getByRole('link', { name: '3 years' })).toHaveAttribute(
      'href',
      '/developers?vertical=crypto&range=3y',
    );
  });

  it('makes an active chain filter explicit in every overall count', () => {
    render(
      <DeveloperReportDashboard
        report={{
          ...report,
          scope: {
            ...report.scope,
            type: 'vertical_chain',
            label: 'Crypto · Ethereum',
            chain: 'ethereum',
            chainsOverlap: true,
          },
        }}
      />,
    );

    expect(
      screen.getByText('Explore Ethereum by category'),
    ).toBeInTheDocument();
    expect(screen.getByText('All categories · Ethereum')).toBeInTheDocument();
    expect(screen.getByText('250')).toBeInTheDocument();
    expect(
      screen.getByText('active developers on Ethereum'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Show all chains' }),
    ).toHaveAttribute('href', '/developers?vertical=crypto');
  });
});
