'use client';

import { useInView } from 'react-intersection-observer';

import useSWRInfinite from 'swr/infinite';

import { flattenJobItems } from '@/lib/jobs/utils/flatten-job-items';

import { JobItem } from '@/lib/jobs/ui/job-item/job-item';
import { JobListSkeleton } from '@/lib/jobs/ui/job-list-skeleton';

import { jobListAction } from '@/lib/jobs/server/actions';

export const JobList = () => {
  const { data, error, isLoading, size, setSize } = useSWRInfinite(
    (pageIndex) => {
      // Start from page 2 because the first page is SSR'd
      const page = pageIndex + 2;
      return { page };
    },
    async (args) => jobListAction(args),
    {
      errorRetryCount: 0,
      revalidateFirstPage: false,
      shouldRetryOnError: false,
    },
  );

  const { ref } = useInView({
    threshold: 1,
    onChange: (inView) => {
      if (inView && !isLoading) {
        setSize(size + 1);
      }
    },
  });

  if (isLoading) return <p>TODO: JobList Loading UI</p>;
  if (error) return <p>TODO: JobList Error UI</p>;

  const jobItems = flattenJobItems(data);

  return (
    <>
      {jobItems.map((job) => (
        <JobItem key={job.id} job={job} />
      ))}
      <div ref={ref} className='py-20'>
        <JobListSkeleton />
      </div>
    </>
  );
};
