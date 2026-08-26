// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type {
  JobMarketOverview,
  JobMarketPoint,
  JobMarketTicker,
} from '../schemas';
import { MarketOverviewDashboard } from './market-overview-dashboard';

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: ReactNode;
    href: string;
  }) => createElement('a', { href, ...props }, children),
}));

const point = (date: string, activeJobs: number): JobMarketPoint => ({
  date,
  activeJobs,
  hiringCompanies: 20,
  newJobs: 4,
  salary: {
    medianMonthlyUsd: null,
    meanMonthlyUsd: null,
    p25MonthlyUsd: null,
    p75MonthlyUsd: null,
    sampleCount: 0,
    coverage: 0,
    evidenceLevel: 'insufficient',
    reliable: false,
  },
  provenance: 'snapshot',
  sampledAt: `${date}T00:00:00.000Z`,
});

const ticker = (
  slug: string,
  label: string,
  baseline: number,
  current: number,
): JobMarketTicker => ({
  kind: slug === 'market' ? 'market' : 'classifications',
  slug,
  label,
  current: point('2026-08-22', current),
  history: [point('2026-08-15', baseline), point('2026-08-22', current)],
  momentum: {
    periodDays: 7,
    currentJobs: 8,
    previousJobs: 10,
    absoluteChange: -2,
    percentChange: -20,
    direction: 'down',
    marketRelativeScore: 10,
    activeJobsChange: 25,
    hiringCompaniesChange: 5,
  },
  activity: {
    newPostings: {
      current: 8,
      baseline: 10,
      absoluteChange: -2,
      percentChange: -20,
      direction: 'down',
      currentWindowDays: 7,
      baselineWindowDays: 7,
    },
    openInventory: {
      current,
      baseline,
      absoluteChange: current - baseline,
      percentChange: 25,
      direction: 'up',
      currentWindowDays: 7,
      baselineWindowDays: 28,
    },
    hiringEmployers: {
      current: 20,
      baseline: 18,
      absoluteChange: 2,
      percentChange: 11.1,
      direction: 'up',
      currentWindowDays: 7,
      baselineWindowDays: 28,
    },
    marketComparison: {
      openInventoryPercentagePoints: 10,
      hiringEmployersPercentagePoints: 5,
      newPostingsPercentagePoints: -3,
    },
  },
  eligibleMover: slug !== 'market',
});

afterEach(cleanup);

describe('MarketOverviewDashboard', () => {
  it('explains weekly vacancy changes and charts recent open vacancies', () => {
    const market = ticker('market', 'Crypto Job Market', 80, 100);
    const backend = ticker('cl-backend', 'Backend', 20, 30);
    const overview: JobMarketOverview = {
      asOf: '2026-08-22',
      market,
      classifications: [backend],
      movers: { bullish: [backend], cooling: [] },
    };

    render(<MarketOverviewDashboard overview={overview} />);

    expect(
      screen.getByRole('heading', { name: 'Market pulse' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Job Market Analytics' }),
    ).toHaveAttribute('href', '/market');
    expect(
      screen.queryByRole('heading', { name: 'Job Market Analytics' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/priced like a market/i)).not.toBeInTheDocument();
    expect(screen.getByText('Weekly change')).toBeInTheDocument();
    expect(screen.getByText('+25.0%')).toBeInTheDocument();
    expect(screen.getByText('+50.0%')).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: 'Backend open vacancies over the last 8 days',
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/open vacancies/i).length).toBeGreaterThan(1);
    expect(screen.getByText('Market pulse')).toHaveClass(
      'text-2xl',
      'text-violet-400',
    );
  });
});
