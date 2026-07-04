import 'server-only';

export interface SitemapEntry {
  loc: string;
  lastModified?: Date;
}

export const escapeXml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';
const RESPONSE_HEADERS = { 'Content-Type': 'application/xml' };

export const buildUrlsetXml = (entries: SitemapEntry[]): string =>
  [
    XML_HEADER,
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(({ loc, lastModified }) => {
      const lastmod = lastModified
        ? `<lastmod>${lastModified.toISOString()}</lastmod>`
        : '';
      return `  <url><loc>${escapeXml(loc)}</loc>${lastmod}</url>`;
    }),
    '</urlset>',
  ].join('\n');

export const buildUrlsetResponse = (entries: SitemapEntry[]): Response =>
  new Response(buildUrlsetXml(entries), { headers: RESPONSE_HEADERS });

export const buildSitemapIndexXml = (locs: string[]): string =>
  [
    XML_HEADER,
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...locs.map((loc) => `  <sitemap><loc>${escapeXml(loc)}</loc></sitemap>`),
    '</sitemapindex>',
  ].join('\n');

export const buildSitemapIndexResponse = (locs: string[]): Response =>
  new Response(buildSitemapIndexXml(locs), { headers: RESPONSE_HEADERS });
