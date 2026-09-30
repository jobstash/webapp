// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FilterConfigSchema } from '@/features/filters/schemas';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

const { params, setParam } = vi.hoisted(() => ({
  params: new URLSearchParams(),
  setParam: vi.fn(),
}));
vi.mock('next/navigation', () => ({ useSearchParams: () => params }));
vi.mock('nuqs', () => ({
  useQueryState: (key: string) => [
    params.get(key),
    (value: string | null) => setParam(key, value),
  ],
}));
vi.mock('@bprogress/next', () => ({ useProgress: () => ({ start: vi.fn() }) }));
vi.mock('@/lib/analytics', () => ({ GA_EVENT: {}, trackEvent: vi.fn() }));
vi.mock('@/lib/env/client', () => ({
  clientEnv: { MW_URL: 'https://example.test' },
}));

import { FiltersAsideClient } from './filters-aside.client';

const configs: FilterConfigSchema[] = [
  {
    kind: 'CHECKBOX',
    label: 'Country',
    paramKey: 'countries',
    options: [{ label: 'Netherlands', value: 'NL' }],
    position: 1,
    analytics: { id: null, name: null },
  },
  {
    kind: 'RADIO',
    label: 'Current Funding Stage',
    paramKey: 'fundingStages',
    options: [{ label: 'Series A', value: 'series-a' }],
    position: 2,
    analytics: { id: null, name: null },
  },
  {
    kind: 'SWITCH',
    label: 'Has Token',
    paramKey: 'token',
    position: 3,
    analytics: { id: null, name: null },
  },
];
afterEach(() => {
  cleanup();
  params.forEach((_, key) => params.delete(key));
  vi.clearAllMocks();
});

describe('main filter panel', () => {
  it('offers previously hidden filters directly and applies the chosen option without selecting a default first', async () => {
    const user = userEvent.setup();
    render(<FiltersAsideClient configs={configs} />);
    expect(
      screen.queryByRole('button', { name: /more filters/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Country' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Has Token' }),
    ).toBeInTheDocument();
    await user.click(
      within(
        screen.getByRole('region', { name: 'Company & funding' }),
      ).getByRole('button', { name: 'Current Funding Stage' }),
    );
    expect(setParam).not.toHaveBeenCalled();
    await user.click(screen.getByRole('menuitem', { name: 'Series A' }));
    expect(setParam).toHaveBeenCalledWith('fundingStages', 'series-a');
    expect(setParam).toHaveBeenCalledWith('page', null);
  });

  it('keeps country options within the mobile drawer and supports removing a selected country', async () => {
    params.set('countries', 'NL');
    const user = userEvent.setup();
    const { container } = render(
      <div data-slot='sheet-content'>
        <FiltersAsideClient configs={configs} />
      </div>,
    );
    await user.click(screen.getByRole('button', { name: 'Country (1)' }));
    const sheet = container.querySelector(
      '[data-slot="sheet-content"]',
    )! as HTMLElement;
    const selected = within(sheet).getByRole('menuitemcheckbox', {
      name: 'Netherlands',
    });
    expect(selected).toHaveAttribute('aria-checked', 'true');
    await user.click(selected);
    expect(setParam).toHaveBeenCalledWith('countries', null);
  });
});
