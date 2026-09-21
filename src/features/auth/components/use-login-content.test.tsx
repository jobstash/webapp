// @vitest-environment jsdom
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('@bprogress/next/app', () => ({ useRouter: () => mocks }));
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(window.location.search),
}));
import { useLoginContent } from './use-login-content';
import { readSignInReturn, saveSignInReturn } from '../lib/return-navigation';
beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
});
afterEach(cleanup);
it('falls back to the homepage rather than Jobs For Me or an old destination', async () => {
  saveSignInReturn({
    href: '/old-job',
    label: 'Back',
    x: 0,
    y: 600,
    phase: 'setup',
  });
  window.history.replaceState({}, '', '/login');
  const { result } = renderHook(useLoginContent);
  await waitFor(() => expect(result.current.destinationReady).toBe(true));
  expect(result.current.redirectTo).toBe('/');
});
it('preserves position across a login reload and uses it when login is cancelled', async () => {
  saveSignInReturn({
    href: '/?page=2',
    label: 'Back',
    x: 0,
    y: 600,
    positionKnown: true,
    phase: 'login',
  });
  window.history.replaceState({}, '', '/login?redirect=%2F%3Fpage%3D2');
  const { result } = renderHook(useLoginContent);
  await waitFor(() => expect(result.current.destinationReady).toBe(true));
  act(() => result.current.handleBack());
  expect(mocks.push).toHaveBeenCalledWith('/?page=2', { scroll: false });
  expect(readSignInReturn()).toMatchObject({ y: 600, phase: 'returning' });
});
it('retains the fragment inherited from a protected-page server redirect', async () => {
  window.history.replaceState(
    {},
    '',
    '/login?redirect=%2Fprofile%3Fview%3Dwork#linked-accounts',
  );
  const { result } = renderHook(useLoginContent);
  await waitFor(() =>
    expect(result.current.redirectTo).toBe(
      '/profile?view=work#linked-accounts',
    ),
  );
});
