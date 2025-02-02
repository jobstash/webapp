import { Suspense } from 'react';

import { PAGE_SIZE } from '@/lib/shared/core/envs';
import { JobListPageSchema } from '@/lib/jobs/core/schemas';

import { JobList } from '@/lib/jobs/ui/job-list';
import { SsrJobList } from '@/lib/jobs/ui/ssr-job-list';

interface Props {
  ssrData: JobListPageSchema['data'];
}

export const JobListPage = ({ ssrData }: Props) => {
  const showClientJobList = ssrData.length >= PAGE_SIZE;
  return (
    <div className='flex w-full justify-center'>
      <div className='w-full max-w-2xl space-y-16 py-16'>
        <SsrJobList jobs={ssrData} />

        {showClientJobList && (
          <Suspense fallback={<p>LOADING ...</p>}>
            <JobList />
          </Suspense>
        )}
      </div>
    </div>
  );
};
