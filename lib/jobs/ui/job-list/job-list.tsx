'use client';

import { JobItem } from '@/lib/jobs/ui/job-item/job-item';
import { JobListSkeleton } from '@/lib/jobs/ui/job-list/job-list-skeleton';

import { useJobList } from './use-job-list';

interface Props {
  startPage?: number;
}

export const JobList = ({ startPage }: Props) => {
  const {
    isLoading,
    isLoadingNextPage,
    isError,
    inViewRef,
    items,
    isListIndicatorVisible,
    isEndReached,
  } = useJobList(startPage);

  if (isLoading) return <JobListSkeleton />;
  if (isError) return <p>TODO: JobList Error UI</p>;

  return (
    <>
      {items.map((job) => (
        <JobItem key={job.id} job={job} />
      ))}

      {isListIndicatorVisible && (
        <div ref={inViewRef} className='py-20'>
          {isLoadingNextPage && <JobListSkeleton />}
          {isEndReached && <p>TODO: No more jobs UI</p>}
        </div>
      )}
    </>
  );
};
