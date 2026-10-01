import { afterEach, expect, it, vi } from 'vitest';
vi.mock('server-only', () => ({}));
vi.mock('@/lib/env/client', () => ({
  clientEnv: { MW_URL: 'https://example.test' },
}));
import { fetchSearchableJobCount } from './fetch-searchable-job-count';
afterEach(() => vi.unstubAllGlobals());
it('uses the full inventory without the latest-import restriction', async () => {
  const fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ total: 1149, totalJobs: 17258 }),
  });
  vi.stubGlobal('fetch', fetch);
  expect(await fetchSearchableJobCount()).toBe(17258);
  const url = new URL(fetch.mock.calls[0][0]);
  expect(url.searchParams.has('batch')).toBe(false);
  expect(url.searchParams.get('limit')).toBe('1');
});
it('does not invent a zero count when the service is unavailable', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
  expect(await fetchSearchableJobCount()).toBeUndefined();
});
