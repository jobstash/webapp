import 'server-only';

import { getFrontendSlug } from '@/features/pillar/constants';
import { pillarSlugsDto } from '@/features/pillar/server/dtos/pillar-slugs.dto';
import { clientEnv } from '@/lib/env/client';

const LIMIT_LENGTH = 255;

export const fetchPillarStaticParams = async () => {
  const url = `${clientEnv.MW_URL}/v2/search/pillar/slugs`;
  const response = await fetch(url, {
    cache: 'force-cache',
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error('Failed to fetch static pillar slugs');

  const json = await response.json();
  const parsed = pillarSlugsDto.safeParse(json);
  if (!parsed.success) throw new Error('Failed to parse static pillar slugs');

  return parsed.data
    .filter((slug) => {
      const isSafe = slug.length <= LIMIT_LENGTH;
      if (!isSafe) {
        console.warn(`[fetchPillarStaticParams] Slug is too long: ${slug}`);
      }
      return isSafe;
    })
    .map((slug) => ({ slug: getFrontendSlug(slug) }));
};
