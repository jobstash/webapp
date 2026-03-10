import { fetchSitemapJobs } from '@/features/jobs/server/data';
import { clientEnv } from '@/lib/env/client';

export const revalidate = 3600;

const FRONTEND_URL = clientEnv.FRONTEND_URL;

export async function GET() {
  const jobs = await fetchSitemapJobs();

  const urls = jobs.map(
    ({ href, lastModified }) =>
      `  <url><loc>${FRONTEND_URL}${href}</loc><lastmod>${lastModified.toISOString()}</lastmod></url>`,
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
