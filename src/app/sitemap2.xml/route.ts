import * as Sentry from '@sentry/nextjs';

import { fetchPillarSitemapSlugs } from '@/features/pillar/server/data';
import { clientEnv } from '@/lib/env/client';

export const revalidate = 3600;

const FRONTEND_URL = clientEnv.FRONTEND_URL;

export async function GET() {
  let slugs: Awaited<ReturnType<typeof fetchPillarSitemapSlugs>> = [];

  try {
    slugs = await fetchPillarSitemapSlugs();
  } catch (error) {
    if (process.env.CI) throw error;
    Sentry.captureException(error);
  }

  const urls = slugs.map(
    ({ slug, lastModified }) =>
      `  <url><loc>${FRONTEND_URL}/${slug}</loc><lastmod>${new Date(lastModified).toISOString()}</lastmod><changefreq>hourly</changefreq></url>`,
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
