import 'server-only';

import { fetchJobListPage } from '@/features/jobs/server/data';
import { JOB_ITEM_BADGE } from '@/features/jobs/constants';
import type { JobListItemSchema } from '@/features/jobs/schemas';
import type { PillarFilterContext } from '@/features/pillar/schemas';

const PILLAR_JOBS_LIMIT = 100;

const sortFeaturedFirst = (jobs: JobListItemSchema[]): JobListItemSchema[] => {
  return [...jobs].sort((a, b) => {
    const aFeatured = a.badge === JOB_ITEM_BADGE.FEATURED ? 1 : 0;
    const bFeatured = b.badge === JOB_ITEM_BADGE.FEATURED ? 1 : 0;
    return bFeatured - aFeatured;
  });
};

interface Props {
  pillarContext: PillarFilterContext;
}

export const fetchPillarJobs = async ({
  pillarContext,
}: Props): Promise<JobListItemSchema[]> => {
  const { paramKey, value } = pillarContext;

  const searchParams = {
    [paramKey]: value,
    publicationDate: 'this-month',
  };

  const { data } = await fetchJobListPage({
    page: 1,
    limit: PILLAR_JOBS_LIMIT,
    searchParams,
  });

  return sortFeaturedFirst(data);
};
