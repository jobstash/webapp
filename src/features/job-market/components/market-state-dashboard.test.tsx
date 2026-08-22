// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));
vi.mock('./flint-echart', () => ({
  FlintEChart: ({ ariaLabel }: { ariaLabel: string }) => (
    <div role='img' aria-label={ariaLabel} />
  ),
}));
vi.mock('./market-geography-map', () => ({
  MarketGeographyMap: () => <div data-testid='salary-map' />,
}));

import type {
  JobMarketCompensation,
  JobMarketPoint,
  JobMarketSkillList,
  JobMarketState,
  JobMarketTicker,
  JobMarketTopPaying,
} from '../schemas';
import { MarketStateDashboard } from './market-state-dashboard';

const point: JobMarketPoint = {
  date: '2026-08-12',
  activeJobs: 1_200,
  hiringCompanies: 340,
  newJobs: 45,
  salary: {
    medianMonthlyUsd: 9_000,
    meanMonthlyUsd: 9_500,
    p25MonthlyUsd: 7_000,
    p75MonthlyUsd: 12_000,
    sampleCount: 100,
    coverage: 0.08,
    evidenceLevel: 'strong',
    reliable: true,
  },
  provenance: 'snapshot',
  sampledAt: '2026-08-12T00:15:00.000Z',
};

const ticker = (overrides: Partial<JobMarketTicker> = {}): JobMarketTicker => ({
  kind: 'classifications',
  slug: 'cl-engineering-management',
  label: 'Engineering Management',
  current: point,
  momentum: {
    periodDays: 7,
    currentJobs: 45,
    previousJobs: 40,
    absoluteChange: 5,
    percentChange: 8,
    direction: 'up',
    marketRelativeScore: 8,
    activeJobsChange: 10,
    hiringCompaniesChange: 5,
  },
  activity: {
    newPostings: {
      current: 45,
      baseline: 40,
      absoluteChange: 5,
      percentChange: 12.5,
      direction: 'up',
      currentWindowDays: 7,
      baselineWindowDays: 7,
    },
    openInventory: {
      current: 1_200,
      baseline: 1_100,
      absoluteChange: 100,
      percentChange: 9.1,
      direction: 'up',
      currentWindowDays: 7,
      baselineWindowDays: 28,
    },
    hiringEmployers: {
      current: 340,
      baseline: 320,
      absoluteChange: 20,
      percentChange: 6.25,
      direction: 'up',
      currentWindowDays: 7,
      baselineWindowDays: 28,
    },
    marketComparison: {
      openInventoryPercentagePoints: 3,
      hiringEmployersPercentagePoints: 2,
      newPostingsPercentagePoints: 4,
    },
  },
  eligibleMover: true,
  ...overrides,
});

const compensation = (
  overrides: Partial<JobMarketCompensation> = {},
): JobMarketCompensation => ({
  segment: 'remote',
  regionSlug: 'remote',
  regionLabel: 'Remote',
  regionType: 'remote',
  filter: null,
  countryCode: null,
  medianMonthlyUsd: 9_000,
  p25MonthlyUsd: 7_000,
  p75MonthlyUsd: 11_000,
  adjustedPremiumPercent: 2,
  sampleCount: 100,
  employerCount: 45,
  onsiteCount: 0,
  hybridCount: 0,
  remoteCount: 100,
  activeJobs: 120,
  hiringCompanies: 45,
  activeOnsiteJobs: 0,
  activeHybridJobs: 0,
  activeRemoteJobs: 120,
  evidenceLevel: 'strong',
  reliable: true,
  ...overrides,
});

const state: JobMarketState = {
  asOf: '2026-08-12',
  completeThrough: '2026-08-12',
  methodologyVersion: 'market-state-v3',
  selectedClassification: 'market',
  selectedClassificationLabel: 'Crypto Job Market',
  range: 'max',
  market: ticker({
    kind: 'market',
    slug: 'market',
    label: 'Crypto Job Market',
  }),
  classifications: [
    ticker(),
    ticker({
      slug: 'cl-forward-deployed-engineer',
      label: 'Forward Deployed Engineer',
      current: { ...point, activeJobs: 0, hiringCompanies: 0, newJobs: 0 },
      eligibleMover: false,
    }),
  ],
  movers: { bullish: [ticker()], cooling: [] },
  geography: [
    compensation(),
    compensation({
      segment: 'local',
      regionSlug: 'local',
      regionLabel: 'All local markets',
      regionType: 'aggregate',
      medianMonthlyUsd: 10_500,
      onsiteCount: 70,
      hybridCount: 30,
      remoteCount: 0,
    }),
  ],
  compensationBands: [],
};

const skills: JobMarketSkillList = {
  asOf: '2026-08-12',
  completeThrough: '2026-08-12',
  methodologyVersion: 'market-state-v3',
  classification: 'market',
  classificationLabel: 'Crypto Job Market',
  segment: 'remote',
  sort: 'breakout',
  query: '',
  skills: [
    {
      slug: 't-typescript',
      label: 'TypeScript',
      segment: 'remote',
      current: compensation({ sampleCount: 40, employerCount: 20 }),
      signal: {
        asOf: '2026-08-12',
        segment: 'remote',
        status: 'rising',
        currentMedianMonthlyUsd: 10_500,
        baselineMedianMonthlyUsd: 9_000,
        rawChangePercent: 16.7,
        adjustedChangePercent: 11.2,
        confidenceLowPercent: 5.4,
        confidenceHighPercent: 17,
        qValue: 0.01,
        recentJobCount: 40,
        baselineJobCount: 45,
        recentEmployerCount: 20,
        baselineEmployerCount: 22,
        signalSince: '2026-08-10',
      },
      momentum: ticker().momentum,
      activeJobs: 80,
      hiringCompanies: 30,
      openJobShare: 6.7,
      strongBreakout: true,
    },
    {
      slug: 't-sparse-skill',
      label: 'Sparse Skill',
      segment: 'remote',
      current: compensation({
        medianMonthlyUsd: null,
        p25MonthlyUsd: null,
        p75MonthlyUsd: null,
        sampleCount: 8,
        employerCount: 4,
        reliable: false,
      }),
      signal: null,
      momentum: ticker().momentum,
      activeJobs: 35,
      hiringCompanies: 14,
      openJobShare: 2.9,
      strongBreakout: false,
    },
  ],
};

const topPaying: JobMarketTopPaying = {
  asOf: '2026-08-12',
  methodologyVersion: 'market-top-pay-v1',
  scope: {
    classification: 'market',
    classificationLabel: 'Crypto Job Market',
    segment: 'remote',
    regionSlug: 'remote',
    regionLabel: 'Remote',
    regionType: 'remote',
    filter: null,
  },
  availableRegions: [
    {
      regionSlug: 'local',
      regionLabel: 'All local markets',
      regionType: 'aggregate',
      activeJobs: 500,
      salarySampleCount: 200,
    },
    {
      regionSlug: 'europe',
      regionLabel: 'Europe',
      regionType: 'continent',
      activeJobs: 300,
      salarySampleCount: 90,
    },
    {
      regionSlug: 'amsterdam',
      regionLabel: 'Amsterdam',
      regionType: 'city',
      activeJobs: 24,
      salarySampleCount: 8,
    },
  ],
  openJobsInScope: 120,
  salaryJobCount: 40,
  salaryCoveragePercent: 33.3,
  topDecileThresholdMonthlyUsd: 15_000,
  topDecileJobCount: 4,
  medianTopDecileMonthlyUsd: 18_000,
  breakdowns: {
    classifications: [
      {
        slug: 'cl-engineering',
        label: 'Engineering',
        jobCount: 3,
        sharePercent: 75,
        medianMonthlyUsd: 18_000,
      },
    ],
    seniorities: [
      {
        slug: 's-lead',
        label: 'Lead',
        jobCount: 3,
        sharePercent: 75,
        medianMonthlyUsd: 18_000,
      },
    ],
    tags: [
      {
        slug: 't-typescript',
        label: 'TypeScript',
        jobCount: 2,
        sharePercent: 50,
        medianMonthlyUsd: 17_500,
      },
    ],
  },
  jobs: [
    {
      id: '101',
      shortUuid: 'abc123',
      title: 'Staff Engineer',
      href: '/staff-engineer-acme/abc123',
      organizationName: 'Acme',
      organizationLogoUrl: null,
      classificationSlug: 'cl-engineering',
      classificationLabel: 'Engineering',
      senioritySlug: 's-lead',
      seniorityLabel: 'Lead',
      location: 'Remote',
      workModes: ['remote'],
      publishedAt: '2026-08-11T00:00:00.000Z',
      salaryMonthlyUsd: 20_000,
      tags: [{ slug: 't-typescript', label: 'TypeScript' }],
    },
  ],
};

afterEach(() => {
  cleanup();
  push.mockClear();
});

describe('MarketStateDashboard', () => {
  it('shows canonical labels, separated pay, and actionable skill drill-down', async () => {
    const user = userEvent.setup();
    render(
      <MarketStateDashboard
        state={state}
        skills={skills}
        scopeMarket={null}
        topPaying={topPaying}
        selection={{
          range: 'max',
          classification: 'market',
          mode: 'remote',
          sort: 'breakout',
          query: '',
          skill: null,
          payRegion: null,
        }}
      />,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Hiring intelligence you can act on',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Engineering Management' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Forward Deployed Engineer' }),
    ).toHaveValue('cl-forward-deployed-engineer');
    expect(screen.getByText('Remote benchmark')).toBeInTheDocument();
    expect(screen.getByText('Local benchmark')).toBeInTheDocument();
    expect(screen.getByTestId('salary-map')).toBeInTheDocument();
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByText('Sparse Skill')).not.toBeInTheDocument();
    const skillRow = screen.getByRole('row', { name: /TypeScript/ });
    expect(within(skillRow).getByText('$9K/mo')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Showing 1 skill with publishable compensation: at least 20 salary listings from 10 employers.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('+11.2%')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'What the top 10% of open jobs pay',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('$15K/mo')).toBeInTheDocument();
    expect(screen.queryByText(/most common/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Staff Engineer' }),
    ).toHaveAttribute('href', '/staff-engineer-acme/abc123');

    await user.click(screen.getByRole('button', { name: 'Analyze' }));
    expect(push).toHaveBeenCalledWith('/market?skill=t-typescript');

    await user.click(screen.getByRole('button', { name: 'Onsite & hybrid' }));
    expect(push).toHaveBeenCalledWith('/market?mode=local');
  });

  it('uses the API-selected market scope when a URL classification is invalid', () => {
    render(
      <MarketStateDashboard
        state={state}
        skills={skills}
        scopeMarket={null}
        topPaying={topPaying}
        selection={{
          range: 'max',
          classification: 'cl-not-real',
          mode: 'remote',
          sort: 'breakout',
          query: '',
          skill: null,
          payRegion: null,
        }}
      />,
    );

    expect(
      screen.getByRole('combobox', { name: /classification/i }),
    ).toHaveValue('market');
  });

  it('navigates top-pay analysis between a city and continent', async () => {
    const user = userEvent.setup();
    const localTopPaying: JobMarketTopPaying = {
      ...topPaying,
      scope: {
        ...topPaying.scope,
        segment: 'local',
        regionSlug: 'amsterdam',
        regionLabel: 'Amsterdam',
        regionType: 'city',
        filter: { paramKey: 'cities', value: 'amsterdam' },
      },
    };
    render(
      <MarketStateDashboard
        state={{
          ...state,
          geography: [
            ...state.geography,
            compensation({
              segment: 'local',
              regionSlug: 'amsterdam',
              regionLabel: 'Amsterdam',
              regionType: 'city',
              activeJobs: 24,
              sampleCount: 8,
            }),
            compensation({
              segment: 'local',
              regionSlug: 'europe',
              regionLabel: 'Europe',
              regionType: 'continent',
              activeJobs: 300,
              sampleCount: 90,
            }),
          ],
        }}
        skills={skills}
        scopeMarket={null}
        topPaying={localTopPaying}
        selection={{
          range: 'max',
          classification: 'market',
          mode: 'local',
          sort: 'breakout',
          query: '',
          skill: null,
          payRegion: 'city:amsterdam',
        }}
      />,
    );

    await user.selectOptions(
      screen.getByRole('combobox', {
        name: /continent, country, region, or city/i,
      }),
      'continent:europe',
    );

    expect(push).toHaveBeenCalledWith(
      '/market?mode=local&payRegion=continent%3Aeurope',
    );
  });

  it('makes a selected classification explicit and only links scoped skills to jobs', () => {
    const scopedState: JobMarketState = {
      ...state,
      selectedClassification: 'cl-engineering-management',
      selectedClassificationLabel: 'Engineering Management',
    };
    const scopedSkills: JobMarketSkillList = {
      ...skills,
      classification: 'cl-engineering-management',
      classificationLabel: 'Engineering Management',
    };

    render(
      <MarketStateDashboard
        state={scopedState}
        skills={scopedSkills}
        scopeMarket={null}
        topPaying={{
          ...topPaying,
          scope: {
            ...topPaying.scope,
            classification: 'cl-engineering-management',
            classificationLabel: 'Engineering Management',
          },
        }}
        selection={{
          range: 'max',
          classification: 'cl-engineering-management',
          mode: 'remote',
          sort: 'breakout',
          query: '',
          skill: null,
          payRegion: null,
        }}
      />,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Engineering Management jobs market',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /open engineering management jobs/i }),
    ).toHaveAttribute('href', '/cl-engineering-management');
    expect(
      screen.queryByRole('button', { name: 'Analyze' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Browse jobs' })).toHaveAttribute(
      'href',
      '/t-typescript',
    );
  });
});
