import { describe, expect, it } from 'vitest';

import type { DeveloperReportPoint } from '../schemas';
import { repositoryGrowthChartOption } from './chart-options';

describe('developer report chart options', () => {
  it('keeps repository origin categories mutually exclusive', () => {
    const option = repositoryGrowthChartOption([
      {
        period: '2026-07-01',
        newRepositories: 10,
        newForkRepositories: 4,
        newUnattributedCopyRepositories: 3,
      } as DeveloperReportPoint,
    ]);
    const series = option.series as { data: number[] }[];

    expect(series.map((item) => item.data)).toEqual([[7], [4], [3]]);
  });
});
