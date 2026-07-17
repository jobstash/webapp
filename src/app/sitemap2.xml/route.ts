import { buildUrlsetResponse } from '@/lib/server/sitemap/build-sitemap-xml';
import { getJobsChunk } from '@/lib/server/sitemap/chunks';

export const revalidate = 3600;

export async function GET() {
  return buildUrlsetResponse(await getJobsChunk(1));
}
