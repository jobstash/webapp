// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { MobileNavigation } from './mobile-navigation';
const session = vi.hoisted(() => ({
  isAuthenticated: false,
  isLoading: false,
}));
vi.mock('@/hooks/use-eligibility', () => ({ useEligibility: () => session }));
vi.mock('@/components/jobstash-logo', () => ({
  JobstashLogo: () => <span>JobStash logo</span>,
}));
afterEach(cleanup);
it('opens reports and login from the logo and closes when a link is selected', async () => {
  session.isAuthenticated = false;
  const user = userEvent.setup();
  render(<MobileNavigation />);
  await user.click(screen.getByRole('button', { name: 'Open navigation' }));
  expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute(
    'href',
    '/login',
  );
  expect(
    screen.queryByRole('link', { name: 'Settings' }),
  ).not.toBeInTheDocument();
  const report = screen.getByRole('link', {
    name: 'Developer ecosystem report',
  });
  expect(report).toHaveAttribute('href', '/developers');
  await user.click(report);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
it('shows profile and settings for an authenticated user', async () => {
  session.isAuthenticated = true;
  const user = userEvent.setup();
  render(<MobileNavigation />);
  await user.click(screen.getByRole('button', { name: 'Open navigation' }));
  expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute(
    'href',
    '/profile',
  );
  expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute(
    'href',
    '/profile/settings',
  );
  expect(
    screen.queryByRole('link', { name: 'Log in' }),
  ).not.toBeInTheDocument();
});
