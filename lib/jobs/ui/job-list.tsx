'use client';

import { useInView } from 'react-intersection-observer';

import useSWRInfinite from 'swr/infinite';

import { JobListItem } from '@/lib/jobs/ui/job-list-item';

import { flattenJobItems } from '../utils/flatten-job-items';

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
        <JobListItem key={job.id} job={job} />
      ))}
      <div className='py-20'>
        <p ref={ref}>Loading ...</p>
      </div>
    </>
  );
};
