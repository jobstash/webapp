import { buildSitemapIndexResponse } from '@/lib/server/sitemap/build-sitemap-xml';
import { SITEMAP_INDEX_PATHS } from '@/lib/server/sitemap/constants';
import { clientEnv } from '@/lib/env/client';

export const dynamic = 'force-static';

const FRONTEND_URL = clientEnv.FRONTEND_URL;

export function GET() {
  // Child sitemaps must live at the site root because they contain root-level
  // page URLs. Keeping this list static also means the index itself cannot
  // fail when the middleware is slow or unavailable.
  const sitemaps = SITEMAP_INDEX_PATHS.map((path) => `${FRONTEND_URL}${path}`);

  return buildSitemapIndexResponse(sitemaps);
}
