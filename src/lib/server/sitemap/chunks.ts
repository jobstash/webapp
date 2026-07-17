import 'server-only';

import { fetchSitemapJobs } from '@/features/jobs/server/data';
import { fetchPillarSitemapSlugs } from '@/features/pillar/server/data';
import { clientEnv } from '@/lib/env/client';

import type { SitemapEntry } from './build-sitemap-xml';
import {
  JOBS_CHUNK_COUNT,
  JOBS_CHUNK_SIZE,
  PILLAR_CHUNK_COUNT,
  PILLAR_CHUNK_SIZE,
} from './constants';

const FRONTEND_URL = clientEnv.FRONTEND_URL;

const sliceChunk = <T>(
  items: T[],
  chunk1Based: number,
  size: number,
  totalChunks: number,
): T[] => {
  if (chunk1Based < 1 || chunk1Based > totalChunks) return [];

  const start = (chunk1Based - 1) * size;
  const end = chunk1Based === totalChunks ? undefined : start + size;
  return items.slice(start, end);
};

export const getJobsChunk = async (
  chunk1Based: number,
): Promise<SitemapEntry[]> => {
  const jobs = await fetchSitemapJobs();
  return sliceChunk(jobs, chunk1Based, JOBS_CHUNK_SIZE, JOBS_CHUNK_COUNT).map(
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
  return sliceChunk(
    slugs,
    chunk1Based,
    PILLAR_CHUNK_SIZE,
    PILLAR_CHUNK_COUNT,
  ).map(({ slug, lastModified }) => ({
    loc: `${FRONTEND_URL}/${slug}`,
    lastModified: new Date(lastModified),
  }));
};
