// @vitest-environment jsdom
import type { ReactNode } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { HeroCtas } from './hero-ctas';

afterEach(() => {
  cleanup();
});

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: ReactNode;
    href: string;
  }) => (
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/lib/analytics', () => ({
  GA_EVENT: { HERO_CTA_CLICKED: 'hero_cta_clicked' },
  trackEvent: vi.fn(),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock('@/components/primary-cta', () => ({
  PrimaryCTA: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock('@/components/hero-jobs-for-you-button.lazy', () => ({
  HeroJobsForYouButton: () => <button>Jobs for You</button>,
}));

describe('HeroCtas', () => {
  it('links the homepage directly to the fully remote jobs pillar', () => {
    render(<HeroCtas />);

    expect(
      screen.getByRole('link', { name: 'Fully Remote Jobs' }),
    ).toHaveAttribute('href', '/lt-fully-remote');
    expect(
      screen.getByRole('button', { name: 'Jobs for You' }),
    ).toBeInTheDocument();
  });
});
