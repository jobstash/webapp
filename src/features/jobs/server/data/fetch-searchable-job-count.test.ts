import { afterEach, expect, it, vi } from 'vitest';
vi.mock('server-only', () => ({}));
vi.mock('@/lib/env/client', () => ({
  clientEnv: { MW_URL: 'https://example.test' },
}));
import { fetchSearchableJobCount } from './fetch-searchable-job-count';
afterEach(() => vi.unstubAllGlobals());
it('uses the exact global count without requesting feed cards or groups', async () => {
  const fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ totalJobs: 17258 }),
  });
  vi.stubGlobal('fetch', fetch);
  expect(await fetchSearchableJobCount()).toBe(17258);
  const url = new URL(fetch.mock.calls[0][0]);
  expect(url.pathname).toBe('/jobs/count');
  expect(url.search).toBe('');
  expect(fetch.mock.calls[0][1]).toEqual({
    cache: 'no-store',
    signal: expect.any(AbortSignal),
  });
});
it('does not invent a zero count when the service is unavailable', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
  expect(await fetchSearchableJobCount()).toBeUndefined();
});
it.each([0, 1, Number.MAX_SAFE_INTEGER])(
  'preserves a valid count of %s',
  async (totalJobs) => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ totalJobs }),
      }),
    );
    expect(await fetchSearchableJobCount()).toBe(totalJobs);
  },
);
it.each([-1, 1.5, '12', null, undefined, Number.MAX_SAFE_INTEGER + 1])(
  'does not display an invalid count of %s',
  async (totalJobs) => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ totalJobs }),
      }),
    );
    expect(await fetchSearchableJobCount()).toBeUndefined();
  },
);
it('retains the unknown state when the count request fails', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockRejectedValue(new Error('Request failed')),
  );
  expect(await fetchSearchableJobCount()).toBeUndefined();
});
