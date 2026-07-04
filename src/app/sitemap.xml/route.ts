import { buildSitemapIndexResponse } from '@/lib/server/sitemap/build-sitemap-xml';
import { getChunkCounts } from '@/lib/server/sitemap/chunks';
import { clientEnv } from '@/lib/env/client';

export const revalidate = 3600;

const FRONTEND_URL = clientEnv.FRONTEND_URL;

export async function GET() {
  const counts = await getChunkCounts();

  // The index and the chunk route derive from the same cached fetches, so it
  // can only reference chunk ids the /sitemaps/[id] route actually serves.
  const sitemaps = [
    `${FRONTEND_URL}/sitemaps/static`,
    ...Array.from(
      { length: counts.jobs },
      (_, i) => `${FRONTEND_URL}/sitemaps/jobs-${i + 1}`,
    ),
    ...Array.from(
      { length: counts.pillars },
      (_, i) => `${FRONTEND_URL}/sitemaps/pillars-${i + 1}`,
    ),
  ];

  return buildSitemapIndexResponse(sitemaps);
}
