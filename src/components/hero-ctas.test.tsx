// @vitest-environment jsdom
import type { ComponentProps } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';
import type { UrlUpdateEvent } from 'nuqs/adapters/testing';

import { ActiveFiltersSearch } from '@/features/filters/components/active-filters/active-filter-search';
import { HeroCtas } from './hero-ctas';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

vi.mock('next/link', () => ({
  default: ({
    prefetch: _,
    ...props
  }: ComponentProps<'a'> & { prefetch?: boolean }) => <a {...props} />,
}));
vi.mock('@bprogress/next', () => ({ useProgress: () => ({ start: vi.fn() }) }));
vi.mock('@/lib/analytics', () => ({ GA_EVENT: {}, trackEvent: vi.fn() }));
vi.mock('@/lib/env/client', () => ({
  clientEnv: { MW_URL: 'https://middleware.test' },
}));
vi.mock('@/components/hero-jobs-for-you-button.lazy', () => ({
  HeroJobsForYouButton: () => <a href='/profile/jobs'>Jobs for me</a>,
}));

const filter = {
  paramKey: 'organizationClassifications',
  options: [
    { label: 'AI', value: 'ai' },
    { label: 'Crypto', value: 'crypto' },
    { label: 'Fintech', value: 'fintech' },
    { label: 'Robotics', value: 'robotics' },
    { label: 'Banking', value: 'banking' },
    { label: 'Web2', value: 'tech' },
    { label: 'Out of scope', value: 'out_of_scope' },
    { label: 'Unclassified', value: 'unclassified' },
  ],
};

afterEach(cleanup);

function renderHomepage(
  searchParams = '?page=4&tags=react&classifications=engineering&workModes=fully-remote',
) {
  const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
  render(
    <NuqsTestingAdapter
      searchParams={searchParams}
      onUrlUpdate={onUrlUpdate}
      hasMemory
      defaultOptions={{ shallow: false }}
    >
      <HeroCtas organizationClassificationFilter={filter} />
      <ActiveFiltersSearch label='Organization classification' {...filter} />
    </NuqsTestingAdapter>,
  );
  return onUrlUpdate;
}

describe('homepage organization filters', () => {
  it.each(filter.options.slice(0, 6))(
    'applies $label with its canonical value without discarding role, skill or work mode',
    async ({ label, value }) => {
      const user = userEvent.setup();
      const onUrlUpdate = renderHomepage();
      await user.click(screen.getByRole('button', { name: `${label} Jobs` }));
      await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());
      const update = onUrlUpdate.mock.calls.at(-1)![0];
      expect(Object.fromEntries(update.searchParams)).toEqual({
        organizationClassifications: value,
        tags: 'react',
        classifications: 'engineering',
        workModes: 'fully-remote',
      });
      expect(update.options.shallow).toBe(false);
      expect(
        screen.getByRole('button', { name: `${label} Jobs` }),
      ).toHaveAttribute('aria-pressed', 'true');
    },
  );

  it('hydrates multiple selected classifications from the URL and removes only the toggled choice', async () => {
    const user = userEvent.setup();
    const onUrlUpdate = renderHomepage(
      '?organizationClassifications=ai,crypto&page=3&orderBy=salary',
    );
    expect(screen.getByRole('button', { name: 'AI Jobs' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Crypto Jobs' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await user.click(screen.getByRole('button', { name: 'Fintech Jobs' }));
    await waitFor(() =>
      expect(
        onUrlUpdate.mock.calls.at(-1)?.[0].searchParams.get(filter.paramKey),
      ).toBe('ai,crypto,fintech'),
    );
    await user.click(screen.getByRole('button', { name: 'AI Jobs' }));
    await waitFor(() =>
      expect(
        onUrlUpdate.mock.calls.at(-1)?.[0].searchParams.get(filter.paramKey),
      ).toBe('crypto,fintech'),
    );
    expect(
      Object.fromEntries(onUrlUpdate.mock.calls.at(-1)![0].searchParams),
    ).toEqual({
      organizationClassifications: 'crypto,fintech',
      orderBy: 'salary',
    });
  });

  it('clears the final selection instead of leaving an empty filter parameter', async () => {
    const user = userEvent.setup();
    const onUrlUpdate = renderHomepage(
      '?organizationClassifications=tech&page=2&tags=typescript',
    );
    await user.click(screen.getByRole('button', { name: 'Web2 Jobs' }));
    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());
    expect(
      Object.fromEntries(onUrlUpdate.mock.calls.at(-1)![0].searchParams),
    ).toEqual({ tags: 'typescript' });
  });

  it('keeps hero selection synchronized when the active filter chip is removed', async () => {
    const user = userEvent.setup();
    const onUrlUpdate = renderHomepage(
      '?organizationClassifications=ai,crypto&page=2&tags=react',
    );
    await user.click(
      screen.getByRole('button', {
        name: 'Remove Organization classification filter',
      }),
    );
    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());
    expect(
      Object.fromEntries(onUrlUpdate.mock.calls.at(-1)![0].searchParams),
    ).toEqual({ tags: 'react' });
    expect(screen.getByRole('button', { name: 'AI Jobs' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: 'Crypto Jobs' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it.each(filter.options.slice(6))(
    'supports the $label active filter without promoting it as a homepage CTA',
    async ({ label, value }) => {
      const user = userEvent.setup();
      const onUrlUpdate = renderHomepage(
        `?organizationClassifications=${value}&page=2&tags=react`,
      );
      expect(
        screen.queryByRole('button', { name: `${label} Jobs` }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Organization classification (1)' }),
      ).toBeInTheDocument();
      await user.click(
        screen.getByRole('button', {
          name: 'Remove Organization classification filter',
        }),
      );
      await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());
      expect(
        Object.fromEntries(onUrlUpdate.mock.calls.at(-1)![0].searchParams),
      ).toEqual({ tags: 'react' });
    },
  );

  it('retains existing pillar CTA destinations without rendering homepage filters', () => {
    render(
      <HeroCtas
        slug='urgently-hiring'
        organizationClassificationFilter={filter}
      />,
    );
    expect(
      screen.getByRole('link', { name: 'Crypto Beginner Jobs' }),
    ).toHaveAttribute('href', '/crypto-beginner-jobs');
    expect(screen.getByRole('link', { name: 'Jobs for me' })).toHaveAttribute(
      'href',
      '/profile/jobs',
    );
    expect(
      screen.queryByRole('button', { name: 'AI Jobs' }),
    ).not.toBeInTheDocument();
  });
});
