// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

// Mock server-only to avoid import errors in tests
vi.mock('server-only', () => ({}));

import { fetchPillarItems } from '@/features/home/server';

import { HeroWithPillars } from './pillar-items';

afterEach(() => {
  cleanup();
});

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('fetchPillarItems', () => {
  it('returns correctly structured data', async () => {
    const items = await fetchPillarItems();

    expect(items.length).toBeGreaterThan(0);

    for (const item of items) {
      expect(item).toHaveProperty('category');
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('href');
      expect(typeof item.category).toBe('string');
      expect(typeof item.label).toBe('string');
      expect(typeof item.href).toBe('string');
      expect(item.href).toMatch(/^\//);
    }
  });

  it('returns items with expected categories', async () => {
    const items = await fetchPillarItems();
    const categories = [...new Set(items.map((item) => item.category))];

    expect(categories).toContain('role');
    expect(categories).toContain('skill');
    expect(categories).toContain('location');
    expect(categories).toContain('commitment');
  });
});

describe('HeroWithPillars', () => {
  it('renders hero heading', async () => {
    render(await HeroWithPillars());

    expect(
      screen.getByRole('heading', { name: /find your next web3 role/i }),
    ).toBeInTheDocument();
  });

  it('renders all pillar items as links', async () => {
    const items = await fetchPillarItems();
    render(await HeroWithPillars());

    for (const item of items) {
      expect(
        screen.getByRole('link', { name: item.label }),
      ).toBeInTheDocument();
    }
  });

  it('renders pillar links with correct hrefs', async () => {
    const items = await fetchPillarItems();
    render(await HeroWithPillars());

    for (const item of items) {
      const link = screen.getByRole('link', { name: item.label });
      expect(link).toHaveAttribute('href', item.href);
    }
  });

  it('renders all pillar items in a floating layout', async () => {
    const items = await fetchPillarItems();
    render(await HeroWithPillars());

    // All items should be rendered as links (no category headers)
    const links = screen.getAllByRole('link');
    // +1 for "Post a Job" CTA (Browse Jobs is a button, not a link)
    expect(links.length).toBe(items.length + 1);
  });

  it('renders primary CTA buttons', async () => {
    render(await HeroWithPillars());

    // Browse Jobs is a button (scrolls to jobs section)
    expect(
      screen.getByRole('button', { name: /browse jobs/i }),
    ).toBeInTheDocument();
    // Post a Job is a link
    expect(
      screen.getByRole('link', { name: /post a job/i }),
    ).toBeInTheDocument();
  });
});
