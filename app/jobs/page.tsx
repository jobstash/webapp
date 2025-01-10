import { Suspense } from 'react';

import { fetchJobListPage } from '@/lib/jobs/api/fetch-job-list-page';

import { JobList } from '@/lib/jobs/ui/job-list';
import { SsrJobList } from '@/lib/jobs/ui/ssr-job-list';

const JobListPage = async () => {
  const { data } = await fetchJobListPage({ page: 1, limit: 6 });
  return (
    <div className='flex w-full justify-center'>
      <div className='w-full max-w-2xl space-y-16 py-16'>
        <SsrJobList jobs={data} />
        <Suspense fallback={<p>JobList Suspense ...</p>}>
          <JobList />
        </Suspense>
      </div>
    </div>
  );
};

export default JobListPage;
