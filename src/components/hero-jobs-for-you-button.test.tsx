// @vitest-environment jsdom
import type { ComponentProps } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  readSignInReturn,
  saveSignInReturn,
} from '@/features/auth/lib/return-navigation';
import { HeroJobsForYouButton } from './hero-jobs-for-you-button';

const state = vi.hoisted(() => ({
  push: vi.fn(),
  eligibility: { isAuthenticated: false, isLoading: false },
}));
vi.mock('@/hooks/use-eligibility', () => ({
  useEligibility: () => state.eligibility,
}));
vi.mock('@bprogress/next/app', () => ({
  useRouter: () => ({ push: state.push }),
}));
vi.mock('next/navigation', () => ({
  usePathname: () => window.location.pathname,
  useSearchParams: () => new URLSearchParams(window.location.search),
}));
vi.mock('next/link', () => ({
  default: ({
    prefetch: _,
    ...props
  }: ComponentProps<'a'> & { prefetch?: boolean }) => <a {...props} />,
}));
vi.mock('@/lib/analytics', () => ({ GA_EVENT: {}, trackEvent: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
  state.eligibility = { isAuthenticated: false, isLoading: false };
  window.history.replaceState(
    {},
    '',
    '/?organizationClassifications=ai&page=3#jobs',
  );
});
afterEach(cleanup);

describe('homepage recommendations navigation', () => {
  it('uses the existing login return flow to reach personal jobs rather than returning to the filtered feed', () => {
    saveSignInReturn({
      href: '/?tags=react',
      label: 'Back to previous page',
      x: 0,
      y: 600,
      phase: 'login',
    });
    render(<HeroJobsForYouButton variant='link' />);
    const link = screen.getByRole('link', {
      name: 'Sign in to get job recommendations',
    });
    expect(link).toHaveAttribute('href', '/login?redirect=%2Fprofile%2Fjobs');
    fireEvent.click(link);
    expect(state.push).toHaveBeenCalledWith(
      '/login?redirect=%2Fprofile%2Fjobs',
    );
    expect(readSignInReturn()).toMatchObject({
      href: '/profile/jobs',
      phase: 'login',
      x: 0,
      y: 0,
      positionKnown: false,
    });
  });

  it('supports opening the sign-in destination in another tab without intercepting navigation', () => {
    render(<HeroJobsForYouButton variant='link' />);
    const link = screen.getByRole('link', {
      name: 'Sign in to get job recommendations',
    });
    fireEvent.click(link, { ctrlKey: true });
    expect(state.push).not.toHaveBeenCalled();
    expect(link).toHaveAttribute('href', '/login?redirect=%2Fprofile%2Fjobs');
    expect(readSignInReturn()?.href).toBe('/profile/jobs');
  });

  it('links authenticated visitors directly to existing personal jobs without starting sign-in', () => {
    state.eligibility.isAuthenticated = true;
    render(<HeroJobsForYouButton variant='link' />);
    const link = screen.getByRole('link', { name: 'Jobs for me' });
    expect(link).toHaveAttribute('href', '/profile/jobs');
    fireEvent.click(link, { ctrlKey: true });
    expect(state.push).not.toHaveBeenCalled();
    expect(readSignInReturn()).toBeNull();
    expect(
      screen.queryByRole('link', { name: /sign in/i }),
    ).not.toBeInTheDocument();
  });

  it('does not expose the wrong authentication action while eligibility is loading', () => {
    state.eligibility.isLoading = true;
    const { rerender } = render(<HeroJobsForYouButton variant='link' />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    state.eligibility = { isAuthenticated: true, isLoading: false };
    rerender(<HeroJobsForYouButton variant='link' />);
    expect(screen.getByRole('link', { name: 'Jobs for me' })).toHaveAttribute(
      'href',
      '/profile/jobs',
    );
  });
});
