import { beforeEach, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({
  path: '/profile/applications?page=2',
  token: null as string | null,
  redirect: vi.fn((href: string) => {
    throw new Error(href);
  }),
}));
vi.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-jobstash-request-path': mocks.path }),
}));
vi.mock('next/navigation', () => ({ redirect: mocks.redirect }));
vi.mock('@/lib/server/session', () => ({
  getSession: async () => ({ apiToken: mocks.token }),
}));
import { AuthGuard } from './auth-guard';
beforeEach(() => {
  vi.clearAllMocks();
  mocks.token = null;
});
it('preserves the requested protected page and query in its login redirect', async () => {
  await expect(AuthGuard({ children: 'protected' })).rejects.toThrow(
    '/login?redirect=%2Fprofile%2Fapplications%3Fpage%3D2',
  );
});
it('does not redirect an existing session', async () => {
  mocks.token = 'test-session';
  await AuthGuard({ children: 'protected' });
  expect(mocks.redirect).not.toHaveBeenCalled();
});
