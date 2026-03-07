import { clientEnv } from '@/lib/env/client';

export const dynamic = 'force-static';

const FRONTEND_URL = clientEnv.FRONTEND_URL;

export function GET() {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <sitemap><loc>${FRONTEND_URL}/sitemap1.xml</loc></sitemap>`,
    `  <sitemap><loc>${FRONTEND_URL}/sitemap2.xml</loc></sitemap>`,
    `  <sitemap><loc>${FRONTEND_URL}/sitemap3.xml</loc></sitemap>`,
    '</sitemapindex>',
  ].join('\n');

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
