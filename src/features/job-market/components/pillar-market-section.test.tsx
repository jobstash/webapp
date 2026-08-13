// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('./flint-echart', () => ({
  FlintEChart: ({ ariaLabel }: { ariaLabel: string }) => (
    <div role='img' aria-label={ariaLabel} />
  ),
}));

import type { PillarMarket } from '../schemas';
import { PillarMarketSection } from './pillar-market-section';

const market: PillarMarket = {
  asOf: '2026-08-12',
  pillar: {
    kind: 'locations',
    slug: 'l-berlin',
    label: 'Berlin',
    filter: { paramKey: 'cities', value: 'berlin' },
  },
  current: {
    date: '2026-08-12',
    activeJobs: 42,
    hiringCompanies: 18,
    newJobs: 3,
    salary: {
      medianMonthlyUsd: null,
      meanMonthlyUsd: null,
      p25MonthlyUsd: null,
      p75MonthlyUsd: null,
      sampleCount: 7,
      coverage: 0.17,
      evidenceLevel: 'limited',
      reliable: false,
    },
    provenance: 'snapshot',
    sampledAt: '2026-08-12T00:15:00.000Z',
  },
  momentum: {
    periodDays: 7,
    currentJobs: 9,
    previousJobs: 6,
    absoluteChange: 3,
    percentChange: 50,
    direction: 'up',
    marketRelativeScore: null,
    activeJobsChange: null,
    hiringCompaniesChange: null,
  },
  history: Array.from({ length: 100 }, (_, index) => ({
    date: new Date(Date.UTC(2026, 4, 5 + index)).toISOString().slice(0, 10),
    activeJobs: 20 + index,
    hiringCompanies: 10,
    newJobs: 1,
    salary: {
      medianMonthlyUsd: null,
      meanMonthlyUsd: null,
      p25MonthlyUsd: null,
      p75MonthlyUsd: null,
      sampleCount: 7,
      coverage: 0.17,
      evidenceLevel: 'limited',
      reliable: false,
    },
    provenance: index < 99 ? ('reconstructed' as const) : ('snapshot' as const),
    sampledAt: '2026-08-12T00:15:00.000Z',
  })),
  compensation: [
    {
      segment: 'remote',
      regionSlug: 'remote',
      regionLabel: 'Remote',
      regionType: 'remote',
      filter: null,
      countryCode: null,
      medianMonthlyUsd: 9_500,
      p25MonthlyUsd: 8_000,
      p75MonthlyUsd: 11_000,
      adjustedPremiumPercent: null,
      sampleCount: 18,
      employerCount: 9,
      onsiteCount: 0,
      hybridCount: 0,
      remoteCount: 18,
      activeJobs: 32,
      hiringCompanies: 14,
      activeOnsiteJobs: 0,
      activeHybridJobs: 0,
      activeRemoteJobs: 32,
      evidenceLevel: 'limited',
      reliable: false,
    },
    {
      segment: 'local',
      regionSlug: 'germany',
      regionLabel: 'Germany',
      regionType: 'country',
      filter: { paramKey: 'countries', value: 'germany' },
      countryCode: 'DEU',
      medianMonthlyUsd: 8_500,
      p25MonthlyUsd: 7_000,
      p75MonthlyUsd: 10_000,
      adjustedPremiumPercent: null,
      sampleCount: 4,
      employerCount: 2,
      onsiteCount: 4,
      hybridCount: 0,
      remoteCount: 0,
      activeJobs: 3,
      hiringCompanies: 2,
      activeOnsiteJobs: 3,
      activeHybridJobs: 0,
      activeRemoteJobs: 0,
      evidenceLevel: 'limited',
      reliable: false,
    },
  ],
  skillSignals: [],
};

afterEach(cleanup);

describe('PillarMarketSection', () => {
  it('shows limited evidence and actionable geographic drill-downs', async () => {
    const user = userEvent.setup();
    render(<PillarMarketSection market={market} />);

    expect(screen.getByText('Berlin market pulse')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('+50.0%')).toBeInTheDocument();
    expect(screen.getAllByText('Limited evidence')).not.toHaveLength(0);
    expect(screen.getByText('$9.5K/mo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /germany/i })).toHaveAttribute(
      'href',
      '/?cities=berlin&countries=germany',
    );

    const oneYear = screen.getByRole('button', { name: '1Y' });
    expect(oneYear).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByRole('img', {
        name: /daily open jobs, hiring companies, and new jobs over 365 days/i,
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '30D' }));
    expect(oneYear).toHaveAttribute('aria-pressed', 'false');
    await user.click(oneYear);
    expect(oneYear).toHaveAttribute('aria-pressed', 'true');
  });

  it('removes uncomputable salary panels and keeps the activity chart', () => {
    const sparseMarket: PillarMarket = {
      ...market,
      current: {
        ...market.current,
        salary: {
          ...market.current.salary,
          medianMonthlyUsd: null,
          p25MonthlyUsd: null,
          p75MonthlyUsd: null,
          evidenceLevel: 'insufficient',
        },
      },
      history: market.history.map((point) => ({
        ...point,
        salary: {
          ...point.salary,
          evidenceLevel: 'insufficient',
        },
      })),
      compensation: market.compensation.map((entry) => ({
        ...entry,
        medianMonthlyUsd: null,
        p25MonthlyUsd: null,
        p75MonthlyUsd: null,
        evidenceLevel: 'insufficient',
      })),
    };

    render(<PillarMarketSection market={sparseMarket} />);

    expect(
      screen.queryByText('Compensation by work market'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Not enough salary samples yet')).toBeNull();
    expect(
      screen.getByRole('img', {
        name: /daily open jobs, hiring companies, and new jobs/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('img', { name: /median and percentile/i }),
    ).not.toBeInTheDocument();
  });
});
