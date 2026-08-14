import { describe, expect, it } from 'vitest';

import type {
  JobMarketPoint,
  JobMarketSkillWeeklyPoint,
  JobMarketTicker,
} from '../schemas';
import {
  activityChartOption,
  marketTreemapOption,
  salaryChartOption,
  skillAdjustedValueOption,
  skillSalaryTrendOption,
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
    evidenceLevel: 'strong',
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
    marketRelativeScore: percentChange,
    activeJobsChange: percentChange,
    hiringCompaniesChange: percentChange,
  },
  activity: {
    newPostings: {
      current: 14,
      baseline: 10,
      absoluteChange: 4,
      percentChange: 40,
      direction: 'up',
      currentWindowDays: 7,
      baselineWindowDays: 7,
    },
    openInventory: {
      current: 100,
      baseline: 90,
      absoluteChange: 10,
      percentChange: 11.1,
      direction: 'up',
      currentWindowDays: 7,
      baselineWindowDays: 28,
    },
    hiringEmployers: {
      current: 30,
      baseline: 28,
      absoluteChange: 2,
      percentChange: 7.1,
      direction: 'up',
      currentWindowDays: 7,
      baselineWindowDays: 28,
    },
    marketComparison: {
      openInventoryPercentagePoints: percentChange,
      hiringEmployersPercentagePoints: 2,
      newPostingsPercentagePoints: 4,
    },
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
          evidenceLevel: 'insufficient',
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

  it('builds observed and adjusted weekly skill-pay charts', () => {
    const weekly: JobMarketSkillWeeklyPoint = {
      weekStart: '2026-08-03',
      segment: 'remote',
      regionSlug: 'all',
      regionLabel: 'Remote',
      medianMonthlyUsd: 10_000,
      p25MonthlyUsd: 8_000,
      p75MonthlyUsd: 12_000,
      adjustedPremiumPercent: 7.5,
      sampleCount: 25,
      employerCount: 12,
      onsiteCount: 0,
      hybridCount: 0,
      remoteCount: 25,
      reliable: false,
    };
    const salarySeries = skillSalaryTrendOption([weekly], 'remote').series;
    const valueSeries = skillAdjustedValueOption([weekly], 'remote').series;

    expect(Array.isArray(salarySeries) ? salarySeries : []).toHaveLength(3);
    expect(Array.isArray(valueSeries) ? valueSeries : []).toHaveLength(1);
    expect(
      (Array.isArray(salarySeries) ? salarySeries : []).every(
        (series) => (series as { showSymbol?: boolean }).showSymbol,
      ),
    ).toBe(true);
    expect(skillSalaryTrendOption([weekly], 'local').series).toBeUndefined();
  });
});
