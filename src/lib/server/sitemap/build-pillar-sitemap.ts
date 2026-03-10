import 'server-only';

import { fetchPillarSitemapSlugs } from '@/features/pillar/server/data';
import { clientEnv } from '@/lib/env/client';

const FRONTEND_URL = clientEnv.FRONTEND_URL;
export const PILLAR_CHUNK_SIZE = 3000;

export async function buildPillarSitemap(chunkIndex: number) {
  const slugs = await fetchPillarSitemapSlugs();
  const start = chunkIndex * PILLAR_CHUNK_SIZE;
  const chunk = slugs.slice(start, start + PILLAR_CHUNK_SIZE);

  const urls = chunk.map(
    ({ slug, lastModified }) =>
      `  <url><loc>${FRONTEND_URL}/${slug}</loc><lastmod>${new Date(lastModified).toISOString()}</lastmod></url>`,
  );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
  ].join('\n');

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
