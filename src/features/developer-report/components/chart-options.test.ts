import { describe, expect, it } from 'vitest';

import type { DeveloperReportPoint } from '../schemas';
import {
  commitsWrittenChartOption,
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

  it('shows one monthly commits-written trend', () => {
    const option = commitsWrittenChartOption([
      {
        period: '2026-07-01',
        commitsWritten: 700,
        inheritedForkCommits: 400,
        inheritedUnattributedCopyCommits: 300,
      } as DeveloperReportPoint,
    ]);
    const series = option.series as { name: string; data: number[] }[];

    expect(series).toHaveLength(1);
    expect(series[0]).toMatchObject({
      name: 'Commits written',
      data: [700],
    });
  });
});
