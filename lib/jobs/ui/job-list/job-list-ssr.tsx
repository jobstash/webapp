import { fetchJobListPage } from '@/lib/jobs/server/data';

import { JobItem } from '@/lib/jobs/ui/job-item/job-item';

export const JobListSSR = async () => {
  const { data: jobs } = await fetchJobListPage({ page: 1 });
  if (!jobs.length) return <p>TODO: Empty SSR UI</p>;
  return (
    <>
      {jobs.map((job) => (
        <JobItem key={job.id} job={job} />
      ))}
    </>
  );
};
