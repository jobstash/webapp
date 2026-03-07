import 'server-only';

import { pillarSitemapSlugsDto } from '@/features/pillar/server/dtos/pillar-sitemap-slugs.dto';
import { clientEnv } from '@/lib/env/client';

const LIMIT_LENGTH = 255;

export const fetchPillarSitemapSlugs = async () => {
  const url = `${clientEnv.MW_URL}/v2/search/sitemap/pillars`;
  const response = await fetch(url, {
    cache: 'force-cache',
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error('Failed to fetch pillar sitemap slugs');

  const json = await response.json();
  const parsed = pillarSitemapSlugsDto.safeParse(json);
  if (!parsed.success) throw new Error('Failed to parse pillar sitemap slugs');

  return parsed.data.data.filter((item) => {
    const isSafe = item.slug.length <= LIMIT_LENGTH;
    if (!isSafe) {
      console.warn(`[fetchPillarSitemapSlugs] Slug too long: ${item.slug}`);
    }
    return isSafe;
  });
};
