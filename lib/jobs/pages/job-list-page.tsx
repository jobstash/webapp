import { Suspense } from 'react';

import { envs } from '@/lib/shared/core/envs';
import { JobListPageSchema } from '@/lib/jobs/core/schemas';

import { AppAside } from '@/lib/shared/ui/app-aside';
import { AppHeader } from '@/lib/shared/ui/app-header';
import { AppSidebar } from '@/lib/shared/ui/app-sidebar';
import { JobList } from '@/lib/jobs/ui/job-list';
import { SsrJobList } from '@/lib/jobs/ui/ssr-job-list';

interface Props {
  ssrData: JobListPageSchema['data'];
}

export const JobListPage = ({ ssrData }: Props) => {
  const showClientJobList = ssrData.length >= envs.PAGE_SIZE;
  return (
    <div className='flex min-h-screen justify-center'>
      <div className='relative flex w-full xl:container'>
        <div className='fixed top-0 z-20 h-10 w-full bg-background' />
        <div className='sticky top-0 z-30 hidden h-screen w-80 p-6 lg:block'>
          <AppSidebar />
        </div>
        <div className='relative flex grow flex-col bg-background'>
          <AppHeader />
          <div className='relative -mt-12 w-full space-y-8 p-4'>
            <SsrJobList jobs={ssrData} />
            {showClientJobList && (
              <Suspense fallback={<p>LOADING ...</p>}>
                <JobList />
              </Suspense>
            )}
          </div>
        </div>
        <div className='sticky top-0 z-30 hidden h-screen w-96 p-6 lg:block'>
          <AppAside />
        </div>
      </div>
    </div>
  );
};
