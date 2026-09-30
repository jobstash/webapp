import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/filters/constants', () => ({
  FILTER_KIND: {
    SORT: 'SORT',
    SWITCH: 'SWITCH',
    RADIO: 'RADIO',
    CHECKBOX: 'CHECKBOX',
    SEARCH: 'SEARCH',
    REMOTE_SEARCH: 'REMOTE_SEARCH',
    RANGE: 'RANGE',
  },
}));

import type { FilterConfigSchema } from '@/features/filters/schemas';

import { getFilterGroup, groupFilterConfigs } from './filter-groups';

const shared = {
  position: 1,
  analytics: { id: null, name: null },
};

const checkbox = (label: string, paramKey: string): FilterConfigSchema => ({
  ...shared,
  kind: 'CHECKBOX',
  label,
  paramKey,
  options: [{ label: 'Option', value: 'option' }],
});

const switchFilter = (label: string, paramKey: string): FilterConfigSchema => ({
  ...shared,
  kind: 'SWITCH',
  label,
  paramKey,
});

describe('filter groups', () => {
  it('groups every filter once in a stable, meaningful order', () => {
    const configs = [
      checkbox('Investors', 'investors'),
      checkbox('Chains', 'chains'),
      checkbox('Work Mode', 'workModes'),
      checkbox('Category', 'classifications'),
      checkbox('Publication Date', 'publicationDate'),
      checkbox('Lead Movements', 'movedLeads'),
      switchFilter('Future Filter', 'futureFilter'),
    ];

    const groups = groupFilterConfigs(configs);

    expect(groups.map(({ label }) => label)).toEqual([
      'Role & requirements',
      'Work setup & location',
      'Pay & timing',
      'Company & funding',
      'Developer activity',
      'Protocol & market',
      'More options',
    ]);
    expect(groups.flatMap(({ configs }) => configs)).toHaveLength(
      configs.length,
    );
    expect(
      groups.flatMap(({ configs }) => configs.map(({ label }) => label)),
    ).toEqual([
      'Category',
      'Work Mode',
      'Publication Date',
      'Investors',
      'Lead Movements',
      'Chains',
      'Future Filter',
    ]);
    expect(getFilterGroup(configs.at(-1)!)).toEqual({
      id: 'other',
      label: 'More options',
    });
  });
});
