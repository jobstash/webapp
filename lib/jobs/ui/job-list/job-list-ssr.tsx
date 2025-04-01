import { JobItemSchema } from '@/lib/jobs/core/schemas';

import { JobItem } from '@/lib/jobs/ui/job-item/job-item';

interface Props {
  jobs: JobItemSchema[];
}

export const JobListSSR = ({ jobs }: Props) => {
  if (!jobs.length) return <p>TODO: Empty SSR UI</p>;
  return (
    <>
      {jobs.map((job) => (
        <JobItem key={job.id} job={job} />
      ))}
    </>
  );
};
