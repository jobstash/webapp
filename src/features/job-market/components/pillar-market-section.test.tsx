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
  pillar: { kind: 'locations', slug: 'l-berlin', label: 'Berlin' },
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
      medianMonthlyUsd: 9_500,
      p25MonthlyUsd: 8_000,
      p75MonthlyUsd: 11_000,
      adjustedPremiumPercent: null,
      sampleCount: 18,
      employerCount: 9,
      onsiteCount: 0,
      hybridCount: 0,
      remoteCount: 18,
      reliable: true,
    },
  ],
  skillSignals: [],
};

afterEach(cleanup);

describe('PillarMarketSection', () => {
  it('shows actionable demand metrics and honest sparse-salary copy', async () => {
    const user = userEvent.setup();
    render(<PillarMarketSection market={market} />);

    expect(screen.getByText('Berlin market pulse')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('+50.0%')).toBeInTheDocument();
    expect(
      screen.getByText('Hidden until 10 samples (7 available)'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Not enough salary samples yet'),
    ).toBeInTheDocument();
    expect(screen.getByText('$9.5K/mo')).toBeInTheDocument();

    const oneYear = screen.getByRole('button', { name: '1Y' });
    await user.click(oneYear);
    expect(oneYear).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByRole('img', {
        name: /daily open jobs, hiring companies, and new jobs over 365 days/i,
      }),
    ).toBeInTheDocument();
  });
});
