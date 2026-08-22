import { describe, expect, it } from 'vitest';

import type { JobMarketSkillList } from '../schemas';
import { withPublishableSkillCompensation } from './skill-evidence';

const list = {
  asOf: '2026-08-12',
  completeThrough: '2026-08-12',
  methodologyVersion: 'market-state-v3',
  classification: 'market',
  classificationLabel: 'Crypto Job Market',
  segment: 'remote',
  sort: 'breakout',
  query: '',
  skills: [
    {
      slug: 't-publishable',
      label: 'Publishable',
      current: {
        reliable: true,
        medianMonthlyUsd: 10_000,
        p25MonthlyUsd: 8_000,
        p75MonthlyUsd: 12_000,
      },
    },
    {
      slug: 't-sparse',
      label: 'Sparse',
      current: {
        reliable: false,
        medianMonthlyUsd: null,
        p25MonthlyUsd: null,
        p75MonthlyUsd: null,
      },
    },
  ],
} as JobMarketSkillList;

describe('withPublishableSkillCompensation', () => {
  it('omits skills whose salary evidence does not meet publication policy', () => {
    expect(
      withPublishableSkillCompensation(list).skills.map((skill) => skill.slug),
    ).toEqual(['t-publishable']);
  });
});
