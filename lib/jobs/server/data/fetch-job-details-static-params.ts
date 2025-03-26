import 'server-only';

import { slugify } from '@/lib/shared/utils/slugify';

import { fetchJobListPage } from './fetch-job-list-page';

export const fetchJobDetailsStaticParams = async () => {
  const jobListPage = await fetchJobListPage({ page: 1, limit: 4000 });
  return jobListPage.data.map((job) => ({
    id: job.id,
    title: slugify(job.title),
  }));
};
