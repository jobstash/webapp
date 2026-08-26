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

import {
  getFilterGroup,
  groupFilterConfigs,
  isPrimaryFilter,
} from './filter-groups';

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
  it('keeps the most-used role, work, location, pay, and timing filters primary', () => {
    const primary = [
      checkbox('Category', 'classifications'),
      checkbox('Commitment', 'commitments'),
      checkbox('Seniority', 'seniority'),
      checkbox('Skills', 'tags'),
      checkbox('Work Mode', 'workModes'),
      checkbox('Country', 'countries'),
      checkbox('Publication Date', 'publicationDate'),
      checkbox('New Active Leads', 'newActiveLeads'),
      {
        ...shared,
        kind: 'RANGE',
        label: 'Salary',
        lowest: { paramKey: 'minSalaryRange', value: 0 },
        highest: { paramKey: 'maxSalaryRange', value: 500_000 },
        prefix: '$',
      } satisfies FilterConfigSchema,
    ];

    expect(primary.every(isPrimaryFilter)).toBe(true);
    expect(isPrimaryFilter(checkbox('Investors', 'investors'))).toBe(false);
    expect(isPrimaryFilter(switchFilter('Has Token', 'token'))).toBe(false);
  });

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
