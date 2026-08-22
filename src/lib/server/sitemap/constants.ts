import 'server-only';

// Keep the number of root-level child sitemap URLs stable so /sitemap.xml
// never needs a middleware request in order to decide which files exist.
export const JOBS_CHUNK_COUNT = 2;
export const PILLAR_CHUNK_COUNT = 3;

export const SITEMAP_INDEX_PATHS = [
  '/sitemap1.xml',
  '/sitemap2.xml',
  '/sitemap6.xml',
  '/sitemap3.xml',
  '/sitemap4.xml',
  '/sitemap5.xml',
] as const;
