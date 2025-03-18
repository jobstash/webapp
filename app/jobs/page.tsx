import { fetchJobListPage } from '@/lib/jobs/server/data';

import { JobListPage } from '@/lib/jobs/pages/job-list-page';

const Page = async () => {
  const { data } = await fetchJobListPage({ page: 1 });
  return <JobListPage ssrData={data} />;
};

export default Page;
