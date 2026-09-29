import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeJobDto } from '../../test/job-fixtures';
import { fetchJobFeed, jobFeedDto } from './fetch-job-feed';

vi.mock('@/lib/env/client', () => ({
  clientEnv: { MW_URL: 'https://middleware.test' },
}));
afterEach(() => vi.unstubAllGlobals());

const batch = (count: number) => ({
  page: 1,
  count: 1,
  total: 1,
  totalJobs: count,
  mode: 'grouped' as const,
  data: [
    {
      key: 'org-acme',
      organizationId: 'org-acme',
      importRunId: 'import-2026-09-29',
      totalJobs: count,
      jobs: [makeJobDto('job-0')],
      jobTitles: Array.from({ length: count }, (_, i) => ({
        id: `db-job-${i}`,
        shortUUID: `job-${i}`,
        title: `Engineer ${i}`,
        location: i % 2 ? 'Berlin' : 'Amsterdam',
      })),
    },
  ],
});

describe('organization job feed', () => {
  it.each([1, 7, 63, 251])(
    'preserves an entire %i-job import without an arbitrary stack limit',
    async (count) => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(Response.json(batch(count))),
      );
      const result = await fetchJobFeed(1, {});
      expect(result.mode).toBe('grouped');
      if (result.mode !== 'grouped') throw new Error('Expected grouped feed');
      expect(result.data[0].jobTitles).toHaveLength(count);
      expect(result.data[0].jobs).toHaveLength(1);
      expect(result.data[0].importRunId).toBe('import-2026-09-29');
      expect(result.data[0].jobTitles.at(-1)).toEqual({
        id: `job-${count - 1}`,
        title: `Engineer ${count - 1}`,
        location: (count - 1) % 2 ? 'Berlin' : 'Amsterdam',
        href: `/engineer-${count - 1}-acme/job-${count - 1}`,
      });
    },
  );

  it('keeps server pagination and filters, without requesting a per-organization cap', async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json(batch(63)));
    vi.stubGlobal('fetch', fetch);
    await fetchJobFeed(3, {
      workModes: 'remote',
      organizations: 'acme',
      page: '2',
    });
    const url = new URL(fetch.mock.calls[0][0]);
    expect(url.pathname).toBe('/jobs/feed');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      workModes: 'remote',
      organizations: 'acme',
      page: '3',
      limit: '10',
      batch: 'latest-import',
    });
    expect(fetch.mock.calls[0][1]).toEqual({ cache: 'no-store' });
  });

  it('still maps individual organization results without adding stack navigation', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json({
          page: 2,
          count: 1,
          total: 11,
          totalJobs: 11,
          mode: 'individual',
          data: [makeJobDto()],
        }),
      ),
    );
    const result = await fetchJobFeed(2, { organizations: 'org-acme' });
    expect(result.mode).toBe('individual');
    expect(result.data[0]).toMatchObject({
      id: 'job-1',
      organization: { href: '/o-acme~org-acme' },
    });
    expect(result.data[0]).not.toHaveProperty('jobTitles');
  });

  it('rejects empty groups so the card always has its first job and title', () => {
    const emptyJobs = batch(1);
    emptyJobs.data[0].jobs = [];
    expect(jobFeedDto.safeParse(emptyJobs).success).toBe(false);
    expect(jobFeedDto.safeParse(batch(0)).success).toBe(false);
  });

  it('uses each job’s own role as the shared fallback when its title is missing', async () => {
    const source = batch(2);
    const titles = source.data[0].jobTitles.map((item, index) => ({
      ...item,
      title: index === 0 ? '' : '  ',
      seniority: index === 0 ? '3' : null,
      classification: index === 0 ? 'engineering' : null,
    }));
    const data = {
      ...source,
      data: [{ ...source.data[0], jobTitles: titles }],
    };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(data)));
    const result = await fetchJobFeed(1, {});
    if (result.mode !== 'grouped') throw new Error('Expected grouped feed');
    expect(result.data[0].jobTitles.map(({ title }) => title)).toEqual([
      'Senior Engineering at Acme',
      'Role at Acme',
    ]);
    expect(result.data[0].jobTitles[0].href).toBe(
      '/senior-engineering-at-acme-acme/job-0',
    );
  });
});
