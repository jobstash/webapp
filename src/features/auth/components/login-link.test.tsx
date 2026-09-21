// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('@bprogress/next/app', () => ({ useRouter: () => mocks }));
vi.mock('next/navigation', () => ({
  usePathname: () => window.location.pathname,
  useSearchParams: () => new URLSearchParams(window.location.search),
}));
vi.mock('next/link', () => ({
  default: ({
    prefetch: _,
    children,
    ...props
  }: React.ComponentProps<'a'> & { prefetch?: boolean }) => (
    <a {...props}>{children}</a>
  ),
}));
import { LoginLink } from './login-link';
import { readSignInReturn } from '../lib/return-navigation';
beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
  window.history.replaceState(
    {},
    '',
    '/lt-fully-remote?page=3&tags=react#jobs',
  );
  vi.stubGlobal('scrollY', 640);
});
afterEach(cleanup);
it('preserves the clicked page, filters, fragment, position and label', () => {
  render(<LoginLink returnLabel='Back to job'>Apply</LoginLink>);
  fireEvent.click(screen.getByRole('link'));
  expect(mocks.push).toHaveBeenCalledWith(
    '/login?redirect=%2Flt-fully-remote%3Fpage%3D3%26tags%3Dreact%23jobs',
  );
  expect(readSignInReturn()).toMatchObject({ y: 640, label: 'Back to job' });
});
it('provides a destination in the href for opening a new tab', () => {
  render(<LoginLink>Log in</LoginLink>);
  expect(screen.getByRole('link')).toHaveAttribute(
    'href',
    '/login?redirect=%2Flt-fully-remote%3Fpage%3D3%26tags%3Dreact%23jobs',
  );
});
it('keeps explicit destinations rather than the current page', () => {
  render(<LoginLink destination='/profile/jobs'>Jobs For You</LoginLink>);
  fireEvent.click(screen.getByRole('link'));
  expect(mocks.push).toHaveBeenCalledWith('/login?redirect=%2Fprofile%2Fjobs');
  expect(readSignInReturn()).toMatchObject({ href: '/profile/jobs', y: 0 });
});
