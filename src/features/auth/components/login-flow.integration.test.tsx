// @vitest-environment jsdom
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const auth = vi.hoisted(() => ({
  authenticated: false,
  onComplete: undefined as
    | undefined
    | ((args: {
        wasAlreadyAuthenticated: boolean;
        loginMethod: string;
      }) => Promise<void>),
  replace: vi.fn(),
}));
vi.mock('@privy-io/react-auth', () => ({
  usePrivy: () => ({
    ready: true,
    authenticated: auth.authenticated,
    user: auth.authenticated
      ? {
          id: 'test-person',
          linkedAccounts: [{ type: 'email', address: 'test@example.com' }],
        }
      : null,
    getAccessToken: async () =>
      auth.authenticated ? 'test-privy-token' : null,
    logout: vi.fn(),
  }),
  useLogin: (options: { onComplete: typeof auth.onComplete }) => {
    auth.onComplete = options.onComplete;
    return { login: vi.fn() };
  },
}));
vi.mock('@bprogress/next/app', () => ({
  useRouter: () => ({ replace: auth.replace }),
}));
vi.mock('@/features/auth/hooks/use-logout', () => ({
  useLogout: () => ({ isLoggingOut: false, logout: vi.fn() }),
}));
vi.mock('@/lib/analytics', () => ({ GA_EVENT: {}, trackEvent: vi.fn() }));

// Session creation, session queries, profile queries and redirect decisions are real.
// Only the external identity provider and HTTP responses are fixtures.
import { useLoginAuth } from './use-login-auth';
import { readSignInReturn, saveSignInReturn } from '../lib/return-navigation';
let client: QueryClient;
let signedIn: boolean;
let complete: boolean;
let failedProfile: boolean;
let verifiedEmail: boolean;
let serverIdentity: string | null;
let exchangeGate: Promise<void> | undefined;
let malformedSession: boolean;
let requests: Array<{ url: string; method: string }>;
const target = '/roblox-developer-metakey/SHc2ct?source=search#skills';
const wrapper = ({ children }: React.PropsWithChildren) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
);

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
  auth.authenticated = false;
  signedIn = false;
  complete = true;
  failedProfile = false;
  verifiedEmail = true;
  serverIdentity = 'test-person';
  exchangeGate = undefined;
  malformedSession = false;
  requests = [];
  client = new QueryClient({
    defaultOptions: { queries: { retry: false, throwOnError: true } },
  });
  saveSignInReturn({
    href: target,
    label: 'Back to job',
    x: 0,
    y: 450,
    positionKnown: true,
    phase: 'login',
  });
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: string, options?: RequestInit) => {
      const url = String(input);
      const method = options?.method ?? 'GET';
      requests.push({ url, method });
      if (url === '/api/auth/session') {
        if (method === 'POST') {
          await exchangeGate;
          signedIn = true;
          serverIdentity = malformedSession ? null : 'test-person';
        }
        return Response.json({
          apiToken: signedIn ? 'test-server-token' : null,
          privyDid: signedIn ? serverIdentity : null,
          expiresAt: Date.now() + 3600000,
          hasVerifiedEmail: signedIn ? verifiedEmail : null,
          isExpert: false,
          displayName: 'Test',
          identityType: 'email',
        });
      }
      if (url === '/api/profile/skills')
        return failedProfile
          ? new Response('Unavailable', { status: 503 })
          : Response.json({
              data: complete
                ? [{ id: 'react', name: 'React', normalizedName: 'react' }]
                : [],
            });
      if (url === '/api/profile/showcase')
        return Response.json({
          data: complete
            ? [
                { label: 'CV', url: '/cv.pdf' },
                { label: 'Website', url: 'https://example.com' },
              ]
            : [],
        });
      throw new Error(`Unexpected request: ${url}`);
    }),
  );
});
afterEach(() => {
  cleanup();
  client.clear();
  vi.unstubAllGlobals();
});

async function signIn() {
  const hook = renderHook(() => useLoginAuth(target, true), { wrapper });
  await waitFor(() => expect(hook.result.current.isLoading).toBe(false));
  await act(async () => {
    auth.authenticated = true;
    await auth.onComplete!({
      wasAlreadyAuthenticated: false,
      loginMethod: 'email',
    });
  });
  return hook;
}

it('creates the session, loads fresh completion data, then returns All-Star users to the exact job', async () => {
  await signIn();
  await waitFor(() =>
    expect(auth.replace).toHaveBeenCalledExactlyOnceWith(target, {
      scroll: false,
    }),
  );
  expect(requests.filter((r) => r.method === 'POST')).toEqual([
    { url: '/api/auth/session', method: 'POST' },
  ]);
  expect(readSignInReturn()).toMatchObject({
    href: target,
    phase: 'returning',
    y: 450,
  });
});
it('sends a successfully signed-in incomplete user to settings while retaining the job and offset', async () => {
  complete = false;
  await signIn();
  await waitFor(() =>
    expect(auth.replace).toHaveBeenCalledWith(
      `/profile/settings?setup=1&redirect=${encodeURIComponent(target)}`,
      { scroll: true },
    ),
  );
  expect(readSignInReturn()).toMatchObject({
    href: target,
    phase: 'setup',
    y: 450,
    label: 'Back to job',
  });
});
it('retries failed profile loading without repeating login or losing the job', async () => {
  failedProfile = true;
  const hook = await signIn();
  await waitFor(() => expect(hook.result.current.profileError).toBe(true));
  expect(auth.replace).not.toHaveBeenCalled();
  expect(hook.result.current.isLoading).toBe(false);
  failedProfile = false;
  act(() => hook.result.current.retryProfile());
  await waitFor(() =>
    expect(auth.replace).toHaveBeenCalledWith(target, { scroll: false }),
  );
  expect(requests.filter((r) => r.method === 'POST')).toHaveLength(1);
});
it('does not redirect or load profile completion before email verification', async () => {
  verifiedEmail = false;
  await signIn();
  expect(auth.replace).not.toHaveBeenCalled();
  expect(
    requests.filter((r) => r.url.startsWith('/api/profile/')),
  ).toHaveLength(0);
});

it('waits for the new account session instead of reading the previous account profile', async () => {
  signedIn = true;
  serverIdentity = 'previous-person';
  let release!: () => void;
  exchangeGate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const hook = renderHook(() => useLoginAuth(target, true), { wrapper });
  await waitFor(() => expect(hook.result.current.isLoading).toBe(false));
  auth.authenticated = true;
  hook.rerender();
  await waitFor(() =>
    expect(requests.filter((r) => r.method === 'POST')).toHaveLength(1),
  );
  let callback!: Promise<void>;
  act(() => {
    callback = auth.onComplete!({
      wasAlreadyAuthenticated: false,
      loginMethod: 'email',
    });
  });
  expect(auth.replace).not.toHaveBeenCalled();
  expect(
    requests.filter((r) => r.url.startsWith('/api/profile/')),
  ).toHaveLength(0);
  await act(async () => {
    release();
    await callback;
  });
  await waitFor(() =>
    expect(auth.replace).toHaveBeenCalledWith(target, { scroll: false }),
  );
  expect(requests.filter((r) => r.method === 'POST')).toHaveLength(1);
});

it('stops after a malformed session response and allows an explicit retry', async () => {
  malformedSession = true;
  const hook = await signIn();
  await waitFor(() => expect(hook.result.current.sessionError).toBe(true));
  hook.rerender();
  expect(requests.filter((r) => r.method === 'POST')).toHaveLength(1);
  expect(auth.replace).not.toHaveBeenCalled();
  malformedSession = false;
  act(() => hook.result.current.retrySession());
  await waitFor(() =>
    expect(auth.replace).toHaveBeenCalledWith(target, { scroll: false }),
  );
  expect(requests.filter((r) => r.method === 'POST')).toHaveLength(2);
});
