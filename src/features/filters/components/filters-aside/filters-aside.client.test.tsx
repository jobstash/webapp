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
import { FiltersDrawerClient } from './filters-drawer.client';

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
  it('renders the same controls in the mobile drawer as in the desktop panel, including the last group', async () => {
    const user = userEvent.setup();
    const desktop = render(<FiltersAsideClient configs={configs} />);
    const labels = screen
      .getAllByRole('button')
      .map((button) => button.textContent);
    desktop.unmount();
    render(<FiltersDrawerClient configs={configs} />);
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    const panel = screen.getByRole('region', { name: 'All job filters' });
    expect(
      within(panel)
        .getAllByRole('button')
        .map((button) => button.textContent),
    ).toEqual(labels);
    expect(
      screen.queryByRole('textbox', { name: 'Find a filter' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /more filters/i }),
    ).not.toBeInTheDocument();
    await user.click(within(panel).getByRole('button', { name: 'Has Token' }));
    expect(setParam).toHaveBeenCalledWith('token', 'true');
  });

  it('exposes sorting in the shared panel and sends changes to the server query with pagination reset', async () => {
    const user = userEvent.setup();
    render(
      <FiltersAsideClient
        configs={[
          {
            ...configs[0],
            kind: 'SORT',
            label: 'Order By',
            paramKey: 'orderBy',
            options: [
              { label: 'Publication Date', value: 'publicationDate' },
              { label: 'Salary', value: 'salary' },
            ],
          },
        ]}
      />,
    );
    await user.click(
      screen.getByRole('button', { name: 'Sort by Publication Date' }),
    );
    expect(setParam).not.toHaveBeenCalled();
    await user.click(screen.getByRole('menuitemradio', { name: 'Salary' }));
    expect(setParam).toHaveBeenCalledWith('orderBy', 'salary');
    expect(setParam).toHaveBeenCalledWith('page', null);
  });

  it('expands mobile search below its trigger inside the filter list without opening a floating popover or forcing keyboard focus', async () => {
    const user = userEvent.setup();
    const region: FilterConfigSchema = {
      ...configs[0],
      kind: 'SEARCH',
      label: 'Region',
      paramKey: 'regions',
      options: [{ label: 'North Holland', value: 'north-holland' }],
    };
    render(<FiltersDrawerClient configs={[region]} />);
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    const trigger = screen.getByRole('button', { name: 'Region' });
    await user.click(trigger);
    const search = screen.getByPlaceholderText('Search region...');
    const content = document.getElementById(
      trigger.getAttribute('aria-controls')!,
    );
    expect(content).toContainElement(search);
    expect(
      screen.getByRole('region', { name: 'All job filters' }),
    ).toContainElement(content);
    expect(content).toHaveAttribute('data-slot', 'filter-disclosure-content');
    expect(
      document.querySelector('[data-radix-popper-content-wrapper]'),
    ).toBeNull();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(search).not.toHaveFocus();
    await user.type(search, 'Holland');
    await user.click(screen.getByRole('heading', { name: 'Filters' }));
    expect(search).toHaveValue('Holland');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.click(trigger);
    expect(
      screen.queryByPlaceholderText('Search region...'),
    ).not.toBeInTheDocument();
    expect(setParam).not.toHaveBeenCalled();
  });

  it('opens continent search without applying Africa or navigating before a choice', async () => {
    Element.prototype.scrollIntoView = vi.fn();
    const user = userEvent.setup();
    const continents: FilterConfigSchema = {
      ...configs[0],
      kind: 'SEARCH',
      label: 'Continent',
      paramKey: 'continents',
      options: [
        { label: 'Africa', value: 'africa' },
        { label: 'Europe', value: 'europe' },
      ],
    };
    render(<FiltersAsideClient configs={[continents]} />);
    await user.click(screen.getByRole('button', { name: 'Continent' }));
    const search = screen.getByPlaceholderText('Search continent...');
    await user.type(search, 'Europe');
    expect(search).toHaveValue('Europe');
    expect(setParam).not.toHaveBeenCalled();
  });

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
