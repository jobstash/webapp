import { ENV } from '@/lib/shared/core/envs';

import { fetchJobListPage } from '@/lib/jobs/server/data';

import { JobList } from '@/lib/jobs/ui/job-list';
import { SsrJobList } from '@/lib/jobs/ui/ssr-job-list';

const Page = async () => {
  const { data } = await fetchJobListPage({ page: 1 });
  const showClientJobList = data.length >= ENV.PAGE_SIZE;

  return (
    <div className='relative w-full space-y-6 overflow-x-hidden px-2.5 md:px-4'>
      <SsrJobList jobs={data} />
      {showClientJobList && <JobList />}
    </div>
  );
};
export default Page;
