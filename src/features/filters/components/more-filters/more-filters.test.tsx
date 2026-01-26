// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock ResizeObserver for cmdk component
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

// Mock scrollIntoView for cmdk component
Element.prototype.scrollIntoView = vi.fn();

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

// Mock nuqs
const mockSetFilterParam = vi.fn();
vi.mock('nuqs', () => ({
  useQueryState: () => [null, mockSetFilterParam],
}));

// Mock @bprogress/next
vi.mock('@bprogress/next', () => ({
  useProgress: () => ({ start: vi.fn() }),
}));

import { MoreFilters } from './more-filters';

afterEach(() => {
  cleanup();
});

describe('MoreFilters', () => {
  const configs: FilterConfigSchema[] = [
    {
      kind: FILTER_KIND.SWITCH,
      label: 'Remote Only',
      paramKey: 'remote',
      position: 1,
      analytics: { id: null, name: null },
    },
    {
      kind: FILTER_KIND.CHECKBOX,
      label: 'Seniority',
      paramKey: 'seniority',
      position: 2,
      analytics: { id: null, name: null },
      options: [{ label: 'Senior', value: 'senior' }],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.forEach((_, key) => mockSearchParams.delete(key));
  });

  it('renders "More Filters" button', () => {
    render(<MoreFilters configs={configs} />);

    expect(
      screen.getByRole('button', { name: /more filters/i }),
    ).toBeInTheDocument();
  });

  it('opens popover on button click', async () => {
    const user = userEvent.setup();
    render(<MoreFilters configs={configs} />);

    await user.click(screen.getByRole('button', { name: /more filters/i }));

    expect(screen.getByPlaceholderText(/search filters/i)).toBeInTheDocument();
  });

  it('displays filter options from useMoreFiltersOptions', async () => {
    const user = userEvent.setup();
    render(<MoreFilters configs={configs} />);

    await user.click(screen.getByRole('button', { name: /more filters/i }));

    expect(screen.getByText('Remote Only')).toBeInTheDocument();
    expect(screen.getByText('Seniority')).toBeInTheDocument();
  });

  it('excludes active filters from options', async () => {
    mockSearchParams.set('remote', 'true');
    const user = userEvent.setup();
    render(<MoreFilters configs={configs} />);

    await user.click(screen.getByRole('button', { name: /more filters/i }));

    expect(screen.queryByText('Remote Only')).not.toBeInTheDocument();
    expect(screen.getByText('Seniority')).toBeInTheDocument();
  });
});
