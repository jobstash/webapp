'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { JobListSkeleton } from './job-list-skeleton';

const JobList = dynamic(() => import('./job-list').then((mod) => mod.JobList), {
  ssr: false,
  loading: () => <JobListSkeleton />,
});

interface Props {
  startPage?: number;
}

export const LazyJobList = ({ startPage }: Props) => {
  return (
    <Suspense fallback={<JobListSkeleton className='py-20' />}>
      <JobList startPage={startPage} />
    </Suspense>
  );
};
