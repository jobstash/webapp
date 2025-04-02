'use client';

import dynamic from 'next/dynamic';

import { JobListSkeleton } from './job-list-skeleton';

export const LazyJobList = dynamic(
  () => import('./job-list').then((mod) => mod.JobList),
  {
    ssr: false,
    loading: () => <JobListSkeleton />,
  },
);
