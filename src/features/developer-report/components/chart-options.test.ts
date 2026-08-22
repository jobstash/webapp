import { describe, expect, it } from 'vitest';

import type { DeveloperReportPoint } from '../schemas';
import {
  mergedPullRequestsChartOption,
  repositoryGrowthChartOption,
} from './chart-options';

describe('developer report chart options', () => {
  it('shows repositories and GitHub forks without unattributed-copy noise', () => {
    const option = repositoryGrowthChartOption([
      {
        period: '2026-07-01',
        newRepositories: 10,
        newForkRepositories: 4,
        newUnattributedCopyRepositories: 3,
      } as DeveloperReportPoint,
    ]);
    const series = option.series as { data: number[] }[];

    expect(series.map((item) => item.data)).toEqual([[3], [4]]);
  });

  it('shows one monthly merged-pull-request trend', () => {
    const option = mergedPullRequestsChartOption([
      {
        period: '2026-07-01',
        mergedPullRequests: 240,
      } as DeveloperReportPoint,
    ]);
    const series = option.series as { name: string; data: number[] }[];

    expect(series).toHaveLength(1);
    expect(series[0]).toMatchObject({
      name: 'Pull requests merged',
      data: [240],
    });
  });
});
