// @vitest-environment jsdom
import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({
  ready: true,
  user: {
    id: 'person-a',
    linkedAccounts: [{ type: 'email', address: 'test@example.com' }],
  },
  skills: vi.fn(),
  showcase: vi.fn(),
}));
vi.mock('@privy-io/react-auth', () => ({ usePrivy: () => mocks }));
vi.mock('@/features/auth/hooks/use-session', () => ({
  useSession: () => ({ isSessionReady: true }),
}));
vi.mock('./use-profile-skills', () => ({ fetchProfileSkills: mocks.skills }));
vi.mock('./use-profile-showcase', () => ({
  fetchProfileShowcase: mocks.showcase,
}));
import { useProfileCompleteness } from './use-profile-completeness';
let client: QueryClient;
const wrapper = ({ children }: React.PropsWithChildren) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
);
beforeEach(() => {
  vi.clearAllMocks();
  client = new QueryClient({
    defaultOptions: { queries: { retry: false, throwOnError: true } },
  });
  mocks.ready = true;
  mocks.user.id = 'person-a';
  mocks.skills.mockResolvedValue([{ id: 'react', name: 'React' }]);
  mocks.showcase.mockResolvedValue([{ label: 'CV' }, { label: 'Website' }]);
});
afterEach(() => {
  cleanup();
  client.clear();
});
it('uses the existing five requirements for All-Star', async () => {
  const { result } = renderHook(() => useProfileCompleteness({ fresh: true }), {
    wrapper,
  });
  await waitFor(() => expect(result.current.isPending).toBe(false));
  expect(result.current.isComplete).toBe(true);
  expect(result.current.completedCount).toBe(5);
});
it('does not mistake a failed profile request for an incomplete profile', async () => {
  mocks.skills.mockRejectedValue(new Error('offline'));
  const { result } = renderHook(() => useProfileCompleteness({ fresh: true }), {
    wrapper,
  });
  await waitFor(() => expect(result.current.isError).toBe(true));
  expect(result.current.isComplete).toBe(false);
});
it('waits for identity before checking profile completion', () => {
  mocks.ready = false;
  const { result } = renderHook(() => useProfileCompleteness({ fresh: true }), {
    wrapper,
  });
  expect(result.current.isPending).toBe(true);
  expect(mocks.skills).not.toHaveBeenCalled();
});
it('does not use another account’s completed profile', async () => {
  client.setQueryData(
    ['profile-skills', 'person-a', 'completion'],
    [{ id: 'react' }],
  );
  client.setQueryData(
    ['profile-showcase', 'person-a', 'completion'],
    [{ label: 'CV' }, { label: 'Website' }],
  );
  mocks.user.id = 'person-b';
  mocks.skills.mockResolvedValue([]);
  mocks.showcase.mockResolvedValue([]);
  const { result } = renderHook(() => useProfileCompleteness({ fresh: true }), {
    wrapper,
  });
  await waitFor(() => expect(result.current.isPending).toBe(false));
  expect(result.current.isComplete).toBe(false);
  expect(result.current.completedCount).toBe(2);
});
