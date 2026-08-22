import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getJobsChunk, getPillarsChunk } from './chunks';
import {
  JOBS_CHUNK_COUNT,
  PILLAR_CHUNK_COUNT,
  SITEMAP_INDEX_PATHS,
} from './constants';

const { mockFetchSitemapJobs, mockFetchPillarSitemapSlugs } = vi.hoisted(
  () => ({
    mockFetchSitemapJobs: vi.fn(),
    mockFetchPillarSitemapSlugs: vi.fn(),
  }),
);

vi.mock('@/features/jobs/server/data', () => ({
  fetchSitemapJobs: mockFetchSitemapJobs,
}));
vi.mock('@/features/pillar/server/data', () => ({
  fetchPillarSitemapSlugs: mockFetchPillarSitemapSlugs,
}));

const makeJobs = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    href: `/job-${i}/uuid-${i}`,
    lastModified: new Date('2026-01-01T00:00:00.000Z'),
  }));

const makeSlugs = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    slug: `t-tag-${i}`,
    lastModified: '2026-01-01T00:00:00.000Z',
  }));

beforeEach(() => {
  mockFetchSitemapJobs.mockReset();
  mockFetchPillarSitemapSlugs.mockReset();
});

describe('sitemap index paths', () => {
  it('keeps every child sitemap at the site root with an xml suffix', () => {
    expect(SITEMAP_INDEX_PATHS).toHaveLength(
      1 + JOBS_CHUNK_COUNT + PILLAR_CHUNK_COUNT,
    );
    expect(
      SITEMAP_INDEX_PATHS.every((path) => /^\/[^/]+\.xml$/.test(path)),
    ).toBe(true);
  });
});

describe('getJobsChunk', () => {
  it('balances the complete inventory across the advertised chunks', async () => {
    mockFetchSitemapJobs.mockResolvedValue(makeJobs(7));

    const first = await getJobsChunk(1);
    const second = await getJobsChunk(2);

    expect(first).toHaveLength(3);
    expect(second).toHaveLength(4);
    expect([...first, ...second].map((item) => item.loc)).toEqual(
      makeJobs(7).map((item) => expect.stringContaining(item.href)),
    );
  });

  it('returns an empty chunk when out of range', async () => {
    mockFetchSitemapJobs.mockResolvedValue(makeJobs(3));
    await expect(getJobsChunk(99)).resolves.toEqual([]);
  });
});

describe('getPillarsChunk', () => {
  it('prefixes slugs with the frontend url and parses lastModified', async () => {
    mockFetchPillarSitemapSlugs.mockResolvedValue(makeSlugs(9));

    const chunk = await getPillarsChunk(1);

    expect(chunk).toHaveLength(3);
    expect(chunk[0].loc).toMatch(/\/t-tag-0$/);
    expect(chunk[0].lastModified).toBeInstanceOf(Date);
  });

  it('keeps every advertised chunk populated after the inventory shrinks', async () => {
    mockFetchPillarSitemapSlugs.mockResolvedValue(makeSlugs(4_773));

    const chunks = await Promise.all(
      Array.from({ length: PILLAR_CHUNK_COUNT }, (_, index) =>
        getPillarsChunk(index + 1),
      ),
    );

    expect(chunks.map((chunk) => chunk.length)).toEqual([1591, 1591, 1591]);
  });
});
