import { JobListItemSchema } from '@/lib/jobs/core/schemas';

import { JobListItem } from '@/lib/jobs/ui/job-list-item';

interface Props {
  jobs: JobListItemSchema[];
}

export const SsrJobList = ({ jobs }: Props) => {
  return (
    <>
      {jobs.map((job) => (
        <JobListItem key={job.id} job={job} />
      ))}
    </>
  );
};
