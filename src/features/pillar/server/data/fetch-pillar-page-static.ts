import 'server-only';

import { clientEnv } from '@/lib/env/client';
import type { PillarPageStatic } from '@/features/pillar/schemas';
import { JOB_ITEM_BADGE } from '@/features/jobs/constants';
import type { JobListItemSchema } from '@/features/jobs/schemas';
import { getApiSlug } from '@/features/pillar/constants';
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

// Pillar pages must never serve a 404 for a transient backend problem:
// notFound() results get cached, and a cached 404 both deindexes the page
// and can stick around long after MW has recovered. Transient failures
// (network, non-OK status, success:false, schema drift) throw instead,
// surfacing as an uncached 500 that retries on the next hit and reports to
// Sentry. `null` is reserved for pillars that genuinely have no data (MW
// answers success:true with data:null); those intentionally stay 404.
export const fetchPillarPageStatic = async (
  slug: string,
): Promise<PillarPageStatic | null> => {
  const apiSlug = getApiSlug(slug);
  const url = `${clientEnv.MW_URL}/search/pillar/page/static/${apiSlug}`;

  const response = await fetch(url, {
    cache: 'force-cache',
    next: { revalidate: 3600 },
  });
  if (!response.ok) {
    throw new Error(
      `Pillar page fetch failed (${response.status}): ${apiSlug}`,
    );
  }

  const json = await response.json();

  if (json?.success === true && json?.data == null) return null;
  if (json?.success === false) {
    throw new Error(
      `Pillar page request failed for ${apiSlug}: ${json?.message}`,
    );
  }

  const parsed = pillarPageStaticDto.safeParse(json);
  if (!parsed.success) {
    throw new Error(`Pillar page payload failed validation: ${apiSlug}`);
  }

  const result = dtoToPillarPageStatic(parsed.data);
  return {
    ...result,
    jobs: sortFeaturedFirst(result.jobs),
  };
};
