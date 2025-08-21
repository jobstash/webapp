import { Suspense } from 'react';

import { JobListSSR, JobListSsrClientWrapper, LazyJobList } from '@/lib/jobs/ui/job-list';
import { JobListSkeleton } from '@/lib/jobs/ui/job-list/job-list-skeleton';

const Page = async () => {
  return (
    <div className='relative w-full space-y-6 overflow-x-hidden'>
      <Suspense fallback={<JobListSkeleton />}>
        <JobListSsrClientWrapper>
          <JobListSSR />
        </JobListSsrClientWrapper>
      </Suspense>
      <LazyJobList />
    </div>
  );
};
export default Page;
