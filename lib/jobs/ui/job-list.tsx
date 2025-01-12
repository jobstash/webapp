'use client';

import { useInView } from 'react-intersection-observer';

import useSWRInfinite from 'swr/infinite';

import { fetchJobListPage } from '@/lib/jobs/api/fetch-job-list-page';

import { JobListItem } from '@/lib/jobs/ui/job-list-item';

export const JobList = () => {
  const { data, isLoading, size, setSize } = useSWRInfinite(
    (page: number) => ({ page: page + 2 }),
    ({ page }) => fetchJobListPage({ page }),
    {
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

  if (!data) return <p>LOADING ...</p>;

  return (
    <>
      {data
        .flatMap((d) => d.data)
        .map((job) => (
          <JobListItem key={job.id} job={job} />
        ))}
      <div className='py-20'>
        <p ref={ref}>Loading ...</p>
      </div>
    </>
  );
};
