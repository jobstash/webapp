import { buildUrlsetResponse } from '@/lib/server/sitemap/build-sitemap-xml';
import { getPillarsChunk } from '@/lib/server/sitemap/chunks';

export const revalidate = 3600;

export async function GET() {
  return buildUrlsetResponse(await getPillarsChunk(2));
}
