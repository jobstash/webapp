// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Define FILTER_KIND locally to avoid importing from constants (which has env deps)
const FILTER_KIND = {
  SORT: 'SORT',
  SWITCH: 'SWITCH',
  RADIO: 'RADIO',
  CHECKBOX: 'CHECKBOX',
  SEARCH: 'SEARCH',
  REMOTE_SEARCH: 'REMOTE_SEARCH',
} as const;

import { type FilterConfigSchema } from '@/features/filters/schemas';

// Mock the constants module to avoid clientEnv validation
vi.mock('@/features/filters/constants', () => ({
  FILTER_KIND: {
    SORT: 'SORT',
    SWITCH: 'SWITCH',
    RADIO: 'RADIO',
    CHECKBOX: 'CHECKBOX',
    SEARCH: 'SEARCH',
    REMOTE_SEARCH: 'REMOTE_SEARCH',
  },
  REMOTE_FILTERS_SET: new Set(['tags']),
}));

// Mock next/navigation
const mockSearchParams = new URLSearchParams();
vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
}));

import { useMoreFiltersOptions } from './use-more-filters-options';

const createSwitchConfig = (
  label: string,
  paramKey: string,
): FilterConfigSchema => ({
  kind: FILTER_KIND.SWITCH,
  label,
  paramKey,
  position: 1,
  analytics: { id: null, name: null },
});

const createCheckboxConfig = (
  label: string,
  paramKey: string,
): FilterConfigSchema => ({
  kind: FILTER_KIND.CHECKBOX,
  label,
  paramKey,
  position: 1,
  analytics: { id: null, name: null },
  options: [{ label: 'Option 1', value: 'opt1' }],
});

const createSortConfig = (
  label: string,
  paramKey: string,
): FilterConfigSchema => ({
  kind: FILTER_KIND.SORT,
  label,
  paramKey,
  position: 1,
  analytics: { id: null, name: null },
  options: [{ label: 'Date', value: 'date' }],
});

describe('useMoreFiltersOptions', () => {
  beforeEach(() => {
    // Clear search params before each test
    mockSearchParams.forEach((_, key) => mockSearchParams.delete(key));
  });

  it('returns all non-order configs when no filters are active', () => {
    const configs: FilterConfigSchema[] = [
      createSwitchConfig('Remote', 'remote'),
      createCheckboxConfig('Seniority', 'seniority'),
    ];

    const { result } = renderHook(() => useMoreFiltersOptions(configs));

    expect(result.current).toHaveLength(2);
    expect(result.current.map((c) => c.label)).toEqual(['Remote', 'Seniority']);
  });

  it('excludes configs that are currently active', () => {
    mockSearchParams.set('remote', 'true');

    const configs: FilterConfigSchema[] = [
      createSwitchConfig('Remote', 'remote'),
      createCheckboxConfig('Seniority', 'seniority'),
    ];

    const { result } = renderHook(() => useMoreFiltersOptions(configs));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].label).toBe('Seniority');
  });

  it('excludes configs with "order" in label (case-insensitive)', () => {
    const configs: FilterConfigSchema[] = [
      createSwitchConfig('Remote', 'remote'),
      createSortConfig('Order By', 'orderBy'),
      createSortConfig('Sort Order', 'sortOrder'),
    ];

    const { result } = renderHook(() => useMoreFiltersOptions(configs));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].label).toBe('Remote');
  });

  it('returns empty array when all configs are active or orders', () => {
    mockSearchParams.set('remote', 'true');

    const configs: FilterConfigSchema[] = [
      createSwitchConfig('Remote', 'remote'),
      createSortConfig('Order By', 'orderBy'),
    ];

    const { result } = renderHook(() => useMoreFiltersOptions(configs));

    expect(result.current).toHaveLength(0);
  });
});
