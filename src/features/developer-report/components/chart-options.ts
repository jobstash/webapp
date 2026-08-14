import type { EChartsCoreOption } from 'echarts/core';

import type { DeveloperReportPoint } from '../schemas';

const axis = {
  axisLine: { lineStyle: { color: '#2a2d2b' } },
  axisLabel: { color: '#8d9691' },
  splitLine: { lineStyle: { color: '#202320' } },
};

const base = {
  animationDuration: 450,
  backgroundColor: 'transparent',
  textStyle: { color: '#d7ddd9', fontFamily: 'inherit' },
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#111512',
    borderColor: '#2d3932',
    textStyle: { color: '#f5f7f5' },
  },
  legend: {
    top: 0,
    textStyle: { color: '#a6aea9' },
  },
  grid: { top: 48, right: 18, bottom: 38, left: 58 },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    ...axis,
  },
  yAxis: {
    type: 'value',
    min: 0,
    ...axis,
  },
};

const dated = (history: DeveloperReportPoint[]) => ({
  ...(base.xAxis as object),
  data: history.map((point) => point.period),
});

export const workforceChartOption = (
  history: DeveloperReportPoint[],
): EChartsCoreOption => ({
  ...base,
  xAxis: dated(history),
  series: [
    {
      name: 'All contributors',
      type: 'line',
      symbol: 'none',
      smooth: 0.18,
      lineStyle: { width: 3, color: '#60a5fa' },
      areaStyle: { color: 'rgba(59, 130, 246, .09)' },
      data: history.map((point) => point.activeContributors),
    },
    {
      name: 'Internal people',
      type: 'line',
      symbol: 'none',
      smooth: 0.18,
      lineStyle: { width: 3, color: '#6ee7b7' },
      areaStyle: { color: 'rgba(52, 211, 153, .12)' },
      data: history.map((point) => point.activePeople),
    },
    {
      name: 'Maintainers',
      type: 'line',
      symbol: 'none',
      smooth: 0.18,
      lineStyle: { width: 2, color: '#fbbf24' },
      data: history.map((point) => point.activeMaintainers),
    },
    {
      name: 'Active leads',
      type: 'line',
      symbol: 'none',
      smooth: 0.18,
      lineStyle: { width: 2, color: '#c084fc' },
      data: history.map((point) => point.activeLeads),
    },
  ],
});

export const cadenceChartOption = (
  history: DeveloperReportPoint[],
): EChartsCoreOption => ({
  ...base,
  xAxis: dated(history),
  series: [
    {
      name: 'Sustained · 10+ days',
      type: 'line',
      stack: 'people',
      symbol: 'none',
      lineStyle: { width: 1, color: '#34d399' },
      areaStyle: { color: 'rgba(52, 211, 153, .68)' },
      data: history.map((point) => point.sustainedPeople),
    },
    {
      name: 'Regular · 2–9 days',
      type: 'line',
      stack: 'people',
      symbol: 'none',
      lineStyle: { width: 1, color: '#60a5fa' },
      areaStyle: { color: 'rgba(96, 165, 250, .54)' },
      data: history.map((point) => point.regularPeople),
    },
    {
      name: 'One-day · 1 day',
      type: 'line',
      stack: 'people',
      symbol: 'none',
      lineStyle: { width: 1, color: '#737a76' },
      areaStyle: { color: 'rgba(115, 122, 118, .48)' },
      data: history.map((point) => point.oneDayPeople),
    },
  ],
});

export const tenureChartOption = (
  history: DeveloperReportPoint[],
): EChartsCoreOption => ({
  ...base,
  xAxis: dated(history),
  series: [
    {
      name: 'Established · 24+ months',
      type: 'line',
      stack: 'people',
      symbol: 'none',
      lineStyle: { width: 1, color: '#a3e635' },
      areaStyle: { color: 'rgba(163, 230, 53, .52)' },
      data: history.map((point) => point.establishedPeople),
    },
    {
      name: 'Emerging · 3–23 months',
      type: 'line',
      stack: 'people',
      symbol: 'none',
      lineStyle: { width: 1, color: '#f59e0b' },
      areaStyle: { color: 'rgba(245, 158, 11, .48)' },
      data: history.map((point) => point.emergingPeople),
    },
    {
      name: 'Newcomers · under 3 months',
      type: 'line',
      stack: 'people',
      symbol: 'none',
      lineStyle: { width: 1, color: '#f472b6' },
      areaStyle: { color: 'rgba(244, 114, 182, .46)' },
      data: history.map((point) => point.newcomerPeople),
    },
  ],
});

export const chainBreadthChartOption = (
  history: DeveloperReportPoint[],
): EChartsCoreOption => ({
  ...base,
  xAxis: dated(history),
  series: [
    {
      name: 'Multi-chain',
      type: 'line',
      stack: 'people',
      symbol: 'none',
      lineStyle: { width: 1, color: '#c084fc' },
      areaStyle: { color: 'rgba(192, 132, 252, .58)' },
      data: history.map((point) => point.multiChainPeople),
    },
    {
      name: 'Single-chain',
      type: 'line',
      stack: 'people',
      symbol: 'none',
      lineStyle: { width: 1, color: '#38bdf8' },
      areaStyle: { color: 'rgba(56, 189, 248, .52)' },
      data: history.map((point) => point.singleChainPeople),
    },
    {
      name: 'Not chain-mapped',
      type: 'line',
      stack: 'people',
      symbol: 'none',
      lineStyle: { width: 1, color: '#71717a' },
      areaStyle: { color: 'rgba(113, 113, 122, .42)' },
      data: history.map((point) => point.unmappedChainPeople),
    },
  ],
});

export const newcomerChartOption = (
  history: DeveloperReportPoint[],
): EChartsCoreOption => ({
  ...base,
  xAxis: {
    ...dated(history),
    boundaryGap: true,
  },
  series: [
    {
      name: 'Newcomer internal people',
      type: 'bar',
      itemStyle: { color: '#f472b6', borderRadius: [3, 3, 0, 0] },
      data: history.map((point) => point.newcomerPeople),
    },
  ],
});

export const repositoryChartOption = (
  history: Array<{ period: string; newRepositories: number }>,
): EChartsCoreOption => ({
  ...base,
  xAxis: {
    ...(base.xAxis as object),
    boundaryGap: true,
    data: history.map((point) => point.period),
  },
  series: [
    {
      name: 'New non-fork repositories',
      type: 'bar',
      itemStyle: { color: '#34d399', borderRadius: [3, 3, 0, 0] },
      data: history.map((point) => point.newRepositories),
    },
  ],
});

export const movementChartOption = (
  history: DeveloperReportPoint[],
): EChartsCoreOption => ({
  ...base,
  xAxis: {
    ...dated(history),
    boundaryGap: true,
  },
  series: [
    {
      name: 'Joined',
      type: 'bar',
      itemStyle: { color: '#34d399', borderRadius: [3, 3, 0, 0] },
      data: history.map((point) => point.joins),
    },
    {
      name: 'Exited',
      type: 'bar',
      itemStyle: { color: '#fb7185', borderRadius: [3, 3, 0, 0] },
      data: history.map((point) => point.exits),
    },
    {
      name: 'Moved between orgs',
      type: 'line',
      symbol: 'none',
      lineStyle: { width: 2, color: '#fbbf24' },
      data: history.map((point) => point.movements),
    },
  ],
});
