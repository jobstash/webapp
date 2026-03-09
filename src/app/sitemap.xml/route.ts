import { fetchPillarSitemapSlugs } from '@/features/pillar/server/data';
import { clientEnv } from '@/lib/env/client';

export const revalidate = 3600;

const FRONTEND_URL = clientEnv.FRONTEND_URL;
const PILLAR_CHUNK_SIZE = 3000;

export async function GET() {
  const slugs = await fetchPillarSitemapSlugs();
  const numChunks = Math.ceil(slugs.length / PILLAR_CHUNK_SIZE);

  const sitemaps = [
    `${FRONTEND_URL}/sitemap/static.xml`,
    ...Array.from(
      { length: numChunks },
      (_, i) => `${FRONTEND_URL}/sitemap/pillar-${i}.xml`,
    ),
    `${FRONTEND_URL}/sitemap/jobs.xml`,
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
