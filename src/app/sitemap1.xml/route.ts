import { clientEnv } from '@/lib/env/client';

export const dynamic = 'force-static';

const FRONTEND_URL = clientEnv.FRONTEND_URL;

export function GET() {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <url><loc>${FRONTEND_URL}</loc><changefreq>hourly</changefreq></url>`,
    '</urlset>',
  ].join('\n');

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
