import { buildPillarSitemap } from '@/lib/server/sitemap/build-pillar-sitemap';

export const revalidate = 3600;

export async function GET() {
  return buildPillarSitemap(1);
}
