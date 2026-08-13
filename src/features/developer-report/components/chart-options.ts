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

export const workforceChartOption = (
  history: DeveloperReportPoint[],
): EChartsCoreOption => ({
  ...base,
  xAxis: {
    ...(base.xAxis as object),
    data: history.map((point) => point.period),
  },
  series: [
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
      lineStyle: { width: 2, color: '#60a5fa' },
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

export const participationChartOption = (
  history: DeveloperReportPoint[],
): EChartsCoreOption => ({
  ...base,
  xAxis: {
    ...(base.xAxis as object),
    data: history.map((point) => point.period),
  },
  series: [
    {
      name: 'Sustained · 10+ days',
      type: 'line',
      stack: 'people',
      symbol: 'none',
      lineStyle: { width: 1, color: '#34d399' },
      areaStyle: { color: 'rgba(52, 211, 153, .7)' },
      data: history.map((point) => point.sustainedPeople),
    },
    {
      name: 'Regular · 2–9 days',
      type: 'line',
      stack: 'people',
      symbol: 'none',
      lineStyle: { width: 1, color: '#60a5fa' },
      areaStyle: { color: 'rgba(96, 165, 250, .55)' },
      data: history.map((point) => point.regularPeople),
    },
    {
      name: 'One-day · 1 day',
      type: 'line',
      stack: 'people',
      symbol: 'none',
      lineStyle: { width: 1, color: '#737a76' },
      areaStyle: { color: 'rgba(115, 122, 118, .5)' },
      data: history.map((point) => point.oneDayPeople),
    },
  ],
});

export const movementChartOption = (
  history: DeveloperReportPoint[],
): EChartsCoreOption => ({
  ...base,
  xAxis: {
    ...(base.xAxis as object),
    boundaryGap: true,
    data: history.map((point) => point.period),
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
