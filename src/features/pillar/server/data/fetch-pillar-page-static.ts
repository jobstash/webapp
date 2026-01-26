import 'server-only';

import { clientEnv } from '@/lib/env/client';
import type { PillarPageStatic } from '@/features/pillar/schemas';
import { JOB_ITEM_BADGE } from '@/features/jobs/constants';
import type { JobListItemSchema } from '@/features/jobs/schemas';
import {
  pillarPageStaticDto,
  dtoToPillarPageStatic,
} from '@/features/pillar/server/dtos';

const sortFeaturedFirst = (jobs: JobListItemSchema[]): JobListItemSchema[] => {
  return [...jobs].sort((a, b) => {
    const aFeatured = a.badge === JOB_ITEM_BADGE.FEATURED ? 1 : 0;
    const bFeatured = b.badge === JOB_ITEM_BADGE.FEATURED ? 1 : 0;
    return bFeatured - aFeatured;
  });
};

export const fetchPillarPageStatic = async (
  slug: string,
): Promise<PillarPageStatic | null> => {
  const url = `${clientEnv.MW_URL}/search/pillar/page/static/${slug}`;

  const response = await fetch(url, {
    cache: 'force-cache',
    next: { revalidate: 3600 },
  });
  if (!response.ok) return null;

  const json = await response.json();
  const parsed = pillarPageStaticDto.safeParse(json);
  if (!parsed.success) return null;

  const result = dtoToPillarPageStatic(parsed.data);
  return {
    ...result,
    jobs: sortFeaturedFirst(result.jobs),
  };
};
