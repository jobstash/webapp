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
  legend: { top: 0, textStyle: { color: '#a6aea9' } },
  grid: { top: 48, right: 18, bottom: 38, left: 58 },
  xAxis: { type: 'category', boundaryGap: false, ...axis },
  yAxis: { type: 'value', min: 0, ...axis },
};

const dated = (history: DeveloperReportPoint[]) => ({
  ...(base.xAxis as object),
  data: history.map((point) => point.period),
});

const line = (name: string, color: string, data: number[], width = 2) => ({
  name,
  type: 'line',
  symbol: 'none',
  smooth: 0.18,
  lineStyle: { width, color },
  data,
});

export const workforceChartOption = (
  history: DeveloperReportPoint[],
): EChartsCoreOption => ({
  ...base,
  xAxis: dated(history),
  series: [
    line(
      'All contributors found',
      '#64748b',
      history.map((point) => point.allContributors),
    ),
    line(
      'Active developers',
      '#60a5fa',
      history.map((point) => point.activeDevelopers),
      3,
    ),
    line(
      'Team developers',
      '#34d399',
      history.map((point) => point.internalDevelopers),
      3,
    ),
    line(
      'Maintainers',
      '#fbbf24',
      history.map((point) => point.activeMaintainers),
    ),
    line(
      'Leads',
      '#c084fc',
      history.map((point) => point.activeLeads),
    ),
  ],
});

const stacked = (name: string, color: string, data: number[]) => ({
  name,
  type: 'line',
  stack: 'developers',
  symbol: 'none',
  lineStyle: { width: 1, color },
  areaStyle: { color, opacity: 0.5 },
  data,
});

export const cadenceChartOption = (
  history: DeveloperReportPoint[],
): EChartsCoreOption => ({
  ...base,
  xAxis: dated(history),
  series: [
    stacked(
      'Full-time · 10+ days',
      '#34d399',
      history.map((point) => point.fullTimeDevelopers),
    ),
    stacked(
      'Part-time · 2–9 days',
      '#60a5fa',
      history.map((point) => point.partTimeDevelopers),
    ),
    stacked(
      'One-time · 1 day',
      '#737a76',
      history.map((point) => point.oneTimeDevelopers),
    ),
  ],
});

export const tenureChartOption = (
  history: DeveloperReportPoint[],
): EChartsCoreOption => ({
  ...base,
  xAxis: dated(history),
  series: [
    stacked(
      'Established · 2+ years',
      '#a3e635',
      history.map((point) => point.establishedDevelopers),
    ),
    stacked(
      'Emerging · 3 months–2 years',
      '#f59e0b',
      history.map((point) => point.emergingDevelopers),
    ),
    stacked(
      'Newcomers · under 3 months',
      '#f472b6',
      history.map((point) => point.newcomerDevelopers),
    ),
  ],
});

export const newDevelopersChartOption = (
  history: DeveloperReportPoint[],
): EChartsCoreOption => ({
  ...base,
  xAxis: { ...dated(history), boundaryGap: true },
  series: [
    {
      name: 'New developers',
      type: 'bar',
      itemStyle: { color: '#60a5fa', borderRadius: [3, 3, 0, 0] },
      data: history.map((point) => point.newDevelopers),
    },
  ],
});

export const repositoryGrowthChartOption = (
  history: DeveloperReportPoint[],
): EChartsCoreOption => ({
  ...base,
  xAxis: { ...dated(history), boundaryGap: true },
  series: [
    {
      name: 'New repositories',
      type: 'bar',
      stack: 'repositories',
      itemStyle: { color: '#34d399', borderRadius: [3, 3, 0, 0] },
      data: history.map((point) =>
        Math.max(
          0,
          point.newRepositories -
            point.newForkRepositories -
            point.newUnattributedCopyRepositories,
        ),
      ),
    },
    {
      name: 'New GitHub forks',
      type: 'bar',
      stack: 'repositories',
      itemStyle: { color: '#60a5fa' },
      data: history.map((point) => point.newForkRepositories),
    },
  ],
});

export const mergedPullRequestsChartOption = (
  history: DeveloperReportPoint[],
): EChartsCoreOption => ({
  ...base,
  xAxis: dated(history),
  series: [
    line(
      'Pull requests merged',
      '#34d399',
      history.map((point) => point.mergedPullRequests),
      3,
    ),
  ],
});
