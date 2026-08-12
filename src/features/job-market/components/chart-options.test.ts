import { describe, expect, it } from 'vitest';

import type { JobMarketPoint, JobMarketTicker } from '../schemas';
import {
  activityChartOption,
  marketTreemapOption,
  salaryChartOption,
  tickerColor,
} from './chart-options';

const point = (overrides: Partial<JobMarketPoint> = {}): JobMarketPoint => ({
  date: '2026-08-12',
  activeJobs: 100,
  hiringCompanies: 30,
  newJobs: 7,
  salary: {
    medianMonthlyUsd: 10_000,
    meanMonthlyUsd: 10_500,
    p25MonthlyUsd: 8_000,
    p75MonthlyUsd: 12_000,
    sampleCount: 12,
    coverage: 0.12,
    reliable: true,
  },
  provenance: 'snapshot',
  sampledAt: '2026-08-12T00:15:00.000Z',
  ...overrides,
});

const ticker = (slug: string, percentChange: number): JobMarketTicker => ({
  kind: 'classifications',
  slug,
  label: slug.replace('cl-', ''),
  current: point(),
  momentum: {
    periodDays: 7,
    currentJobs: 14,
    previousJobs: 10,
    absoluteChange: percentChange > 0 ? 4 : -4,
    percentChange,
    direction: percentChange > 0 ? 'up' : 'down',
  },
  eligibleMover: true,
});

describe('job-market Flint chart options', () => {
  it('assembles activity lines and new-job bars', () => {
    const option = activityChartOption([point()]);
    const series = Array.isArray(option.series) ? option.series : [];
    expect(series).toHaveLength(3);
    expect(series.map((item) => (item as { type?: string }).type)).toEqual(
      expect.arrayContaining(['line', 'line', 'bar']),
    );
  });

  it('omits salary series when the sample threshold is not met', () => {
    const option = salaryChartOption([
      point({
        salary: {
          medianMonthlyUsd: null,
          meanMonthlyUsd: null,
          p25MonthlyUsd: null,
          p75MonthlyUsd: null,
          sampleCount: 9,
          coverage: 0.09,
          reliable: false,
        },
      }),
    ]);
    expect(option.series).toBeUndefined();
  });

  it('encodes canonical slugs in clickable treemap tiles', () => {
    const growing = ticker('cl-backend', 40);
    const cooling = ticker('cl-frontend', -40);
    const option = marketTreemapOption([growing, cooling]);
    const series = Array.isArray(option.series) ? option.series[0] : undefined;
    const data = (series as { data?: { slug?: string }[] })?.data ?? [];

    expect(data.map((item) => item.slug)).toEqual([
      'cl-backend',
      'cl-frontend',
    ]);
    expect(tickerColor(growing)).not.toBe(tickerColor(cooling));
  });
});
