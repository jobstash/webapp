import type { MetadataRoute } from 'next';

import { fetchSitemapJobs } from '@/features/jobs/server/data';
import { fetchPillarSitemapSlugs } from '@/features/pillar/server/data';
import { clientEnv } from '@/lib/env/client';

export const revalidate = 3600;

const FRONTEND_URL = clientEnv.FRONTEND_URL;
const PILLAR_CHUNK_SIZE = 3000;

export async function generateSitemaps() {
  const slugs = await fetchPillarSitemapSlugs();
  const numChunks = Math.ceil(slugs.length / PILLAR_CHUNK_SIZE);

  return [
    { id: 'static' },
    ...Array.from({ length: numChunks }, (_, i) => ({ id: `pillar-${i}` })),
    { id: 'jobs' },
  ];
}

export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const resolvedId = await id;

  if (resolvedId === 'static') {
    return [{ url: FRONTEND_URL }];
  }

  if (resolvedId === 'jobs') {
    const jobs = await fetchSitemapJobs();
    return jobs.map(({ href, lastModified }) => ({
      url: `${FRONTEND_URL}${href}`,
      lastModified,
    }));
  }

  // pillar-0, pillar-1, pillar-2, ...
  const chunkIndex = Number(resolvedId.split('-')[1]);
  const slugs = await fetchPillarSitemapSlugs();
  const start = chunkIndex * PILLAR_CHUNK_SIZE;
  const chunk = slugs.slice(start, start + PILLAR_CHUNK_SIZE);

  return chunk.map(({ slug, lastModified }) => ({
    url: `${FRONTEND_URL}/${slug}`,
    lastModified: new Date(lastModified),
  }));
}
