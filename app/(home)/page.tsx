import { envs } from '@/lib/shared/core/envs';

import { fetchJobListPage } from '@/lib/jobs/server/data';

import { AppHeader } from '@/lib/shared/ui/app-header';
import { JobList } from '@/lib/jobs/ui/job-list';
import { SsrJobList } from '@/lib/jobs/ui/ssr-job-list';

const Page = async () => {
  const { data } = await fetchJobListPage({ page: 1 });
  const showClientJobList = data.length >= envs.PAGE_SIZE;

  return (
    <>
      <AppHeader />
      <div className='relative w-full space-y-8 p-4'>
        <SsrJobList jobs={data} />
        {showClientJobList && <JobList />}
      </div>
    </>
  );
};
export default Page;
