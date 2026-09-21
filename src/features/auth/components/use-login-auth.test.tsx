// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  authenticated: true,
  session: { isAuthenticated: true, isLoading: false, hasVerifiedEmail: true },
  profile: {
    isPending: false,
    isError: false,
    isComplete: true,
    retry: vi.fn(),
  },
  mark: vi.fn(),
}));
vi.mock('@bprogress/next/app', () => ({
  useRouter: () => ({ replace: mocks.replace }),
}));
vi.mock('@privy-io/react-auth', () => ({
  usePrivy: () => ({
    ready: true,
    authenticated: mocks.authenticated,
    user: { id: 'test-person' },
  }),
  useLogin: () => ({ login: vi.fn() }),
}));
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));
vi.mock('@/features/auth/hooks/use-session', () => ({
  useSession: () => mocks.session,
}));
vi.mock('@/features/profile/hooks/use-profile-completeness', () => ({
  useProfileCompleteness: () => mocks.profile,
}));
vi.mock('../lib/return-navigation', () => ({ markSignInReturn: mocks.mark }));
vi.mock('@/lib/analytics', () => ({ GA_EVENT: {}, trackEvent: vi.fn() }));
vi.mock('@/features/auth/lib/create-session', () => ({
  createSession: vi.fn(),
}));
import { useLoginAuth } from './use-login-auth';

beforeEach(() => {
  vi.clearAllMocks();
  mocks.authenticated = true;
  Object.assign(mocks.session, {
    isAuthenticated: true,
    privyDid: 'test-person',
    hasVerifiedEmail: true,
  });
  Object.assign(mocks.profile, {
    isPending: false,
    isError: false,
    isComplete: true,
  });
});
describe('post-login routing', () => {
  it('returns a complete profile to its exact page only once', () => {
    const { rerender } = renderHook(() =>
      useLoginAuth('/lt-remote?page=4#jobs', true),
    );
    rerender();
    expect(mocks.replace).toHaveBeenCalledExactlyOnceWith(
      '/lt-remote?page=4#jobs',
      { scroll: false },
    );
  });
  it('detours incomplete profiles through settings while retaining the target', () => {
    mocks.profile.isComplete = false;
    renderHook(() => useLoginAuth('/jobs/example?source=search', true));
    expect(mocks.replace).toHaveBeenCalledWith(
      '/profile/settings?setup=1&redirect=%2Fjobs%2Fexample%3Fsource%3Dsearch',
      { scroll: true },
    );
    expect(mocks.mark).toHaveBeenCalledWith(
      '/jobs/example?source=search',
      'setup',
    );
  });
  it('waits for completion data and email verification', () => {
    mocks.profile.isPending = true;
    const { rerender } = renderHook(() => useLoginAuth('/job', true));
    expect(mocks.replace).not.toHaveBeenCalled();
    mocks.profile.isPending = false;
    mocks.session.hasVerifiedEmail = false;
    rerender();
    expect(mocks.replace).not.toHaveBeenCalled();
    mocks.session.hasVerifiedEmail = true;
    rerender();
    expect(mocks.replace).toHaveBeenCalledWith('/job', { scroll: false });
  });
  it('shows a retry on failure instead of redirecting or spinning forever', () => {
    mocks.profile.isError = true;
    const { result } = renderHook(() => useLoginAuth('/job', true));
    expect(mocks.replace).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.profileError).toBe(true);
    result.current.retryProfile();
    expect(mocks.profile.retry).toHaveBeenCalled();
  });
  it('waits until the original destination has been restored', () => {
    renderHook(() => useLoginAuth('/', false));
    expect(mocks.replace).not.toHaveBeenCalled();
  });
});

it('offers sign-in when only the server session remains', () => {
  mocks.authenticated = false;
  const { result } = renderHook(() => useLoginAuth('/job', true));
  expect(result.current.isLoading).toBe(false);
  expect(mocks.replace).not.toHaveBeenCalled();
});
it('does not redirect after the user cancels while profile data is loading', () => {
  mocks.profile.isPending = true;
  const { result, rerender } = renderHook(() => useLoginAuth('/job', true));
  result.current.cancelRedirect();
  mocks.profile.isPending = false;
  rerender();
  expect(mocks.replace).not.toHaveBeenCalled();
});
