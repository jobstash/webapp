import { fetchPillarSitemapSlugs } from '@/features/pillar/server/data';
import { clientEnv } from '@/lib/env/client';

export const revalidate = 3600;

const FRONTEND_URL = clientEnv.FRONTEND_URL;
const PILLAR_CHUNK_SIZE = 3000;

export async function GET() {
  const slugs = await fetchPillarSitemapSlugs();
  const numPillarChunks = Math.ceil(slugs.length / PILLAR_CHUNK_SIZE);

  // sitemap1 = static, sitemap2 = jobs, sitemap3+ = pillar chunks
  const sitemaps = [
    `${FRONTEND_URL}/sitemap1.xml`,
    `${FRONTEND_URL}/sitemap2.xml`,
    ...Array.from(
      { length: numPillarChunks },
      (_, i) => `${FRONTEND_URL}/sitemap${i + 3}.xml`,
    ),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemaps.map((loc) => `  <sitemap><loc>${loc}</loc></sitemap>`),
    '</sitemapindex>',
  ].join('\n');

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
