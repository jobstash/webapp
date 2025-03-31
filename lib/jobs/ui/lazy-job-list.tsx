'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { JobListSkeleton } from './job-list-skeleton';

const JobList = dynamic(() => import('./job-list').then((mod) => mod.JobList), {
  ssr: false,
  loading: () => <JobListSkeleton />,
});

export const LazyJobList = () => {
  return (
    <Suspense fallback={<JobListSkeleton />}>
      <JobList />
    </Suspense>
  );
};
