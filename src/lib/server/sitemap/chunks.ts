import 'server-only';

import { fetchSitemapJobs } from '@/features/jobs/server/data';
import { fetchPillarSitemapSlugs } from '@/features/pillar/server/data';
import { clientEnv } from '@/lib/env/client';

import type { SitemapEntry } from './build-sitemap-xml';
import { JOBS_CHUNK_SIZE, PILLAR_CHUNK_SIZE } from './constants';

const FRONTEND_URL = clientEnv.FRONTEND_URL;

// Always at least one chunk, so /sitemaps/jobs-1 and /sitemaps/pillars-1
// exist (as empty urlsets) even if a fetch briefly returns nothing.
const chunkCount = (length: number, size: number): number =>
  Math.max(1, Math.ceil(length / size));

const sliceChunk = <T>(items: T[], chunk1Based: number, size: number): T[] => {
  const start = (chunk1Based - 1) * size;
  return items.slice(start, start + size);
};

export const getJobsChunk = async (
  chunk1Based: number,
): Promise<SitemapEntry[]> => {
  const jobs = await fetchSitemapJobs();
  return sliceChunk(jobs, chunk1Based, JOBS_CHUNK_SIZE).map(
    ({ href, lastModified }) => ({
      loc: `${FRONTEND_URL}${href}`,
      lastModified,
    }),
  );
};

export const getPillarsChunk = async (
  chunk1Based: number,
): Promise<SitemapEntry[]> => {
  const slugs = await fetchPillarSitemapSlugs();
  return sliceChunk(slugs, chunk1Based, PILLAR_CHUNK_SIZE).map(
    ({ slug, lastModified }) => ({
      loc: `${FRONTEND_URL}/${slug}`,
      lastModified: new Date(lastModified),
    }),
  );
};

export const getChunkCounts = async (): Promise<{
  jobs: number;
  pillars: number;
}> => {
  const [jobs, pillars] = await Promise.all([
    fetchSitemapJobs(),
    fetchPillarSitemapSlugs(),
  ]);

  return {
    jobs: chunkCount(jobs.length, JOBS_CHUNK_SIZE),
    pillars: chunkCount(pillars.length, PILLAR_CHUNK_SIZE),
  };
};
