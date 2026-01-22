import 'server-only';

import { pillarSlugsDto } from '@/features/pillar/server/dtos/pillar-details.dto';
import { clientEnv } from '@/lib/env/client';

const LIMIT_LENGTH = 255;

export const fetchPillarStaticParams = async () => {
  const url = `${clientEnv.MW_URL}/search/pillar/slugs?nav=jobs`;
  const response = await fetch(url, {
    cache: 'force-cache',
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error('Failed to fetch static pillar slugs');

  const json = await response.json();
  const parsed = pillarSlugsDto.safeParse(json);
  if (!parsed.success) throw new Error('Failed to parse static pillar slugs');

  // Skip slugs that are too long
  const filteredSlugs = parsed.data.filter((slug) => {
    const isSafe = slug.length <= LIMIT_LENGTH;
    if (!isSafe) {
      console.warn(`[fetchStaticPillarSlugs] Slug is too long: ${slug}`);
    }
    return isSafe;
  });

  return filteredSlugs.map((slug) => ({ slug }));
};
