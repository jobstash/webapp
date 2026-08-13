import { assembleECharts, type ChartAssemblyInput } from 'flint-chart';
import type { EChartsCoreOption } from 'echarts/core';

import type {
  JobMarketPoint,
  JobMarketSkillWeeklyPoint,
  JobMarketTicker,
} from '../schemas';
import { compactNumber, monthlySalary } from '../lib/format';

const chartBase = {
  backgroundColor: 'transparent',
  animationDuration: 350,
  textStyle: { color: '#a1a1aa', fontFamily: 'inherit' },
};

const axisStyle = {
  axisLine: { lineStyle: { color: '#3f3f46' } },
  axisLabel: { color: '#a1a1aa' },
  splitLine: { lineStyle: { color: 'rgba(113, 113, 122, 0.16)' } },
  nameTextStyle: { color: '#a1a1aa' },
};

const styleCartesian = (option: EChartsCoreOption): EChartsCoreOption => ({
  ...option,
  ...chartBase,
  grid: { left: 48, right: 20, top: 40, bottom: 42, containLabel: false },
  legend: {
    ...(option.legend as object),
    top: 0,
    textStyle: { color: '#a1a1aa' },
  },
  xAxis: Array.isArray(option.xAxis)
    ? option.xAxis.map((axis) => ({ ...axis, ...axisStyle, name: '' }))
    : { ...(option.xAxis as object), ...axisStyle, name: '' },
  yAxis: Array.isArray(option.yAxis)
    ? option.yAxis.map((axis) => ({ ...axis, ...axisStyle, name: '' }))
    : { ...(option.yAxis as object), ...axisStyle, name: '' },
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#18181b',
    borderColor: '#3f3f46',
    textStyle: { color: '#fafafa' },
  },
});

export const activityChartOption = (
  history: JobMarketPoint[],
): EChartsCoreOption => {
  const values = history.flatMap((point) => [
    { date: point.date, value: point.activeJobs, series: 'Open jobs' },
    {
      date: point.date,
      value: point.hiringCompanies,
      series: 'Hiring companies',
    },
    { date: point.date, value: point.newJobs, series: 'New jobs' },
  ]);
  const input: ChartAssemblyInput = {
    data: { values },
    semantic_types: {
      date: 'Date',
      value: 'Quantity',
      series: 'Category',
    },
    chart_spec: {
      chartType: 'Line Chart',
      encodings: {
        x: { field: 'date' },
        y: { field: 'value' },
        color: { field: 'series' },
      },
    },
  };
  const option = styleCartesian(assembleECharts(input));
  const series = Array.isArray(option.series) ? option.series : [];
  option.series = series.map((item) => {
    const record = item as Record<string, unknown>;
    const name = String(record.name ?? '');
    return {
      ...record,
      type: name === 'New jobs' ? 'bar' : 'line',
      smooth: name !== 'New jobs',
      symbol: 'none',
      barMaxWidth: 9,
      lineStyle: {
        width: name === 'Open jobs' ? 3 : 2,
      },
      itemStyle: {
        color:
          name === 'Open jobs'
            ? '#34d399'
            : name === 'Hiring companies'
              ? '#60a5fa'
              : '#a78bfa',
        opacity: name === 'New jobs' ? 0.55 : 1,
      },
    };
  });
  return option;
};

export const salaryChartOption = (
  history: JobMarketPoint[],
): EChartsCoreOption => {
  const values = history.flatMap((point) => {
    if (!point.salary.reliable) return [];
    return [
      {
        date: point.date,
        value: point.salary.medianMonthlyUsd,
        series: 'Median',
      },
      { date: point.date, value: point.salary.p25MonthlyUsd, series: '25th' },
      { date: point.date, value: point.salary.p75MonthlyUsd, series: '75th' },
    ].filter((value) => value.value !== null);
  });
  if (values.length === 0) return { ...chartBase };
  const input: ChartAssemblyInput = {
    data: { values },
    semantic_types: {
      date: 'Date',
      value: 'Amount',
      series: 'Category',
    },
    chart_spec: {
      chartType: 'Line Chart',
      encodings: {
        x: { field: 'date' },
        y: { field: 'value' },
        color: { field: 'series' },
      },
    },
  };
  const option = styleCartesian(assembleECharts(input));
  const series = Array.isArray(option.series) ? option.series : [];
  option.series = series.map((item) => {
    const record = item as Record<string, unknown>;
    const name = String(record.name ?? '');
    return {
      ...record,
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: {
        width: name === 'Median' ? 3 : 1,
        type: name === 'Median' ? 'solid' : 'dashed',
        opacity: name === 'Median' ? 1 : 0.65,
      },
      itemStyle: {
        color:
          name === 'Median'
            ? '#fbbf24'
            : name === '25th'
              ? '#fb7185'
              : '#38bdf8',
      },
    };
  });
  return option;
};

const mix = (
  from: readonly [number, number, number],
  to: readonly [number, number, number],
  amount: number,
) =>
  `rgb(${from.map((channel, index) => Math.round(channel + (to[index] - channel) * amount)).join(', ')})`;

export const tickerColor = (ticker: JobMarketTicker): string => {
  const neutral = [39, 39, 42] as const;
  if (ticker.activity.openInventory.direction === 'new') {
    return mix(neutral, [5, 150, 105], 0.85);
  }
  const change =
    ticker.activity.marketComparison.openInventoryPercentagePoints ?? 0;
  if (Math.abs(change) < 5) return mix(neutral, [82, 82, 91], 0.45);
  const strength = Math.min(1, 0.35 + Math.abs(change) / 100);
  return change > 0
    ? mix(neutral, [5, 150, 105], strength)
    : mix(neutral, [220, 38, 38], strength);
};

const marketDifferenceLabel = (ticker: JobMarketTicker): string => {
  const value = ticker.activity.marketComparison.openInventoryPercentagePoints;
  return value === null
    ? 'Not enough history'
    : `${value > 0 ? '+' : ''}${value.toFixed(1)} points vs market`;
};

export const marketTreemapOption = (
  tickers: JobMarketTicker[],
): EChartsCoreOption => {
  const values = tickers.map((ticker) => ({
    classification: ticker.label,
    activeJobs: ticker.current.activeJobs,
  }));
  const input: ChartAssemblyInput = {
    data: { values },
    semantic_types: {
      classification: 'Category',
      activeJobs: 'Quantity',
    },
    chart_spec: {
      chartType: 'Treemap',
      encodings: {
        color: { field: 'classification' },
        size: { field: 'activeJobs' },
      },
    },
  };
  const option = assembleECharts(input) as EChartsCoreOption;
  const byLabel = new Map(tickers.map((ticker) => [ticker.label, ticker]));
  const baseSeries = Array.isArray(option.series)
    ? (option.series[0] as Record<string, unknown>)
    : (option.series as Record<string, unknown> | undefined);
  const data = Array.isArray(baseSeries?.data) ? baseSeries.data : [];
  return {
    ...option,
    ...chartBase,
    tooltip: {
      renderMode: 'richText',
      backgroundColor: '#18181b',
      borderColor: '#3f3f46',
      textStyle: { color: '#fafafa' },
      formatter: (params: { name: string }) => {
        const ticker = byLabel.get(params.name);
        if (!ticker) return params.name;
        return [
          ticker.label,
          `${compactNumber(ticker.current.activeJobs)} open jobs`,
          `${compactNumber(ticker.current.hiringCompanies)} hiring companies`,
          `Open-job change: ${marketDifferenceLabel(ticker)}`,
          monthlySalary(ticker.current.salary.medianMonthlyUsd),
        ].join('\n');
      },
    },
    series: [
      {
        ...baseSeries,
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        label: {
          show: true,
          color: '#fafafa',
          textShadowColor: 'rgba(0,0,0,.5)',
          textShadowBlur: 3,
          formatter: (params: { name: string }) => {
            const ticker = byLabel.get(params.name);
            if (!ticker) return params.name;
            const salary = ticker.current.salary.medianMonthlyUsd;
            return [
              `{name|${ticker.label}}`,
              `{value|${compactNumber(ticker.current.activeJobs)} jobs}`,
              `{move|${marketDifferenceLabel(ticker)}}`,
              ...(salary === null ? [] : [`{salary|${monthlySalary(salary)}}`]),
            ].join('\n');
          },
          rich: {
            name: { fontSize: 17, fontWeight: 700, lineHeight: 24 },
            value: { fontSize: 13, lineHeight: 19 },
            move: { fontSize: 13, fontWeight: 700, lineHeight: 19 },
            salary: { fontSize: 12, lineHeight: 18, color: '#e4e4e7' },
          },
        },
        upperLabel: { show: false },
        itemStyle: { borderColor: '#18181b', borderWidth: 2, gapWidth: 2 },
        data: data.map((item) => {
          const record = item as Record<string, unknown>;
          const ticker = byLabel.get(String(record.name ?? ''));
          return {
            ...record,
            slug: ticker?.slug,
            itemStyle: { color: ticker ? tickerColor(ticker) : '#27272a' },
          };
        }),
      },
    ],
  };
};

export const skillSalaryTrendOption = (
  history: JobMarketSkillWeeklyPoint[],
  segment: 'remote' | 'local',
): EChartsCoreOption => {
  const values = history
    .filter(
      (point) =>
        point.segment === segment &&
        point.regionSlug === 'all' &&
        point.reliable,
    )
    .flatMap((point) => [
      {
        date: point.weekStart,
        value: point.medianMonthlyUsd,
        series: 'Median monthly pay',
      },
      {
        date: point.weekStart,
        value: point.p25MonthlyUsd,
        series: '25th percentile',
      },
      {
        date: point.weekStart,
        value: point.p75MonthlyUsd,
        series: '75th percentile',
      },
    ])
    .filter(
      (entry): entry is { date: string; value: number; series: string } =>
        entry.value !== null,
    );
  if (values.length === 0) return { ...chartBase };
  const input: ChartAssemblyInput = {
    data: { values },
    semantic_types: {
      date: 'Date',
      value: 'Amount',
      series: 'Category',
    },
    chart_spec: {
      chartType: 'Line Chart',
      encodings: {
        x: { field: 'date' },
        y: { field: 'value' },
        color: { field: 'series' },
      },
    },
  };
  const option = styleCartesian(assembleECharts(input));
  const series = Array.isArray(option.series) ? option.series : [];
  option.series = series.map((item) => {
    const record = item as Record<string, unknown>;
    const median = record.name === 'Median monthly pay';
    return {
      ...record,
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: {
        width: median ? 3 : 1,
        type: median ? 'solid' : 'dashed',
        opacity: median ? 1 : 0.6,
      },
      itemStyle: {
        color: median
          ? '#34d399'
          : record.name === '25th percentile'
            ? '#60a5fa'
            : '#f59e0b',
      },
    };
  });
  return option;
};

export const skillAdjustedValueOption = (
  history: JobMarketSkillWeeklyPoint[],
  segment: 'remote' | 'local',
): EChartsCoreOption => {
  const values = history
    .filter(
      (point) =>
        point.segment === segment &&
        point.regionSlug === 'all' &&
        point.reliable &&
        point.adjustedPremiumPercent !== null,
    )
    .map((point) => ({
      date: point.weekStart,
      value: point.adjustedPremiumPercent as number,
      series: 'Adjusted skill premium',
    }));
  if (values.length === 0) return { ...chartBase };
  const option = styleCartesian(
    assembleECharts({
      data: { values },
      semantic_types: {
        date: 'Date',
        value: 'Percentage',
        series: 'Category',
      },
      chart_spec: {
        chartType: 'Line Chart',
        encodings: {
          x: { field: 'date' },
          y: { field: 'value' },
          color: { field: 'series' },
        },
      },
    }),
  );
  const series = Array.isArray(option.series) ? option.series : [];
  option.series = series.map((item) => ({
    ...(item as Record<string, unknown>),
    type: 'line',
    smooth: true,
    symbol: 'none',
    areaStyle: { color: 'rgba(167, 139, 250, 0.16)' },
    lineStyle: { width: 3, color: '#a78bfa' },
    itemStyle: { color: '#a78bfa' },
  }));
  return option;
};
