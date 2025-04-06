import 'server-only';

import { slugify } from '@/lib/shared/utils/slugify';

import { fetchJobListPage } from './fetch-job-list-page';

const MAX_JOBS = 4000;

export const fetchJobDetailsStaticParams = async () => {
  const jobListPage = await fetchJobListPage({ page: 1, limit: MAX_JOBS });
  return jobListPage.data.map((job) => ({
    id: job.id,
    slug: slugify(job.title),
  }));
};
