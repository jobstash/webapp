import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getJobsChunk, getPillarsChunk } from './chunks';
import {
  JOBS_CHUNK_COUNT,
  JOBS_CHUNK_SIZE,
  PILLAR_CHUNK_COUNT,
  PILLAR_CHUNK_SIZE,
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
  it('slices 1-based chunks of the configured size', async () => {
    mockFetchSitemapJobs.mockResolvedValue(makeJobs(JOBS_CHUNK_SIZE + 2));

    const first = await getJobsChunk(1);
    const second = await getJobsChunk(2);

    expect(first).toHaveLength(JOBS_CHUNK_SIZE);
    expect(second).toHaveLength(2);
    expect(second[0].loc).toContain(`/job-${JOBS_CHUNK_SIZE}/`);
  });

  it('returns an empty chunk when out of range', async () => {
    mockFetchSitemapJobs.mockResolvedValue(makeJobs(3));
    await expect(getJobsChunk(99)).resolves.toEqual([]);
  });

  it('keeps later growth in the final advertised chunk', async () => {
    mockFetchSitemapJobs.mockResolvedValue(
      makeJobs(JOBS_CHUNK_SIZE * JOBS_CHUNK_COUNT + 2),
    );

    const final = await getJobsChunk(JOBS_CHUNK_COUNT);

    expect(final).toHaveLength(JOBS_CHUNK_SIZE + 2);
    expect(final[0].loc).toContain(`/job-${JOBS_CHUNK_SIZE}/`);
  });
});

describe('getPillarsChunk', () => {
  it('prefixes slugs with the frontend url and parses lastModified', async () => {
    mockFetchPillarSitemapSlugs.mockResolvedValue(makeSlugs(2));

    const chunk = await getPillarsChunk(1);

    expect(chunk).toHaveLength(2);
    expect(chunk[0].loc).toMatch(/\/t-tag-0$/);
    expect(chunk[0].lastModified).toBeInstanceOf(Date);
  });

  it('keeps later growth in the final advertised chunk', async () => {
    mockFetchPillarSitemapSlugs.mockResolvedValue(
      makeSlugs(PILLAR_CHUNK_SIZE * PILLAR_CHUNK_COUNT + 1),
    );

    const final = await getPillarsChunk(PILLAR_CHUNK_COUNT);

    expect(final).toHaveLength(PILLAR_CHUNK_SIZE + 1);
  });
});
