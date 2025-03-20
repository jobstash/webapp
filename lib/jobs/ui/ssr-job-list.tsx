import { JobListItemSchema } from '@/lib/jobs/core/schemas';

import { JobListItem } from '@/lib/jobs/ui/job-list-item/job-list-item';

interface Props {
  jobs: JobListItemSchema[];
}

export const SsrJobList = ({ jobs }: Props) => {
  if (!jobs.length) return <p>TODO: Empty SSR UI</p>;
  return (
    <>
      {jobs.map((job) => (
        <JobListItem key={job.id} job={job} />
      ))}
    </>
  );
};
