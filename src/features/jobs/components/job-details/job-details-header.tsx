import { type JobDetailsSchema } from '@/features/jobs/schemas';
import { JOB_ITEM_BADGE } from '@/features/jobs/constants';
import { JobListItemBadge } from '@/features/jobs/components/job-list/job-list-item/job-list-item-badge';
import { JobListItemInfoTags } from '@/features/jobs/components/job-list/job-list-item/job-list-item-info-tags';
import { EligibilityBadge } from '@/features/jobs/components/job-list/job-list-item/eligibility-badge.lazy';

import { BackToJobs } from './back-to-jobs';

interface JobDetailsHeaderProps {
  job: JobDetailsSchema;
}

export const JobDetailsHeader = ({ job }: JobDetailsHeaderProps) => {
  const { title, badge, infoTags } = job;

  return (
    <header className='space-y-4'>
      <BackToJobs />

      {badge && (
        <div className='flex items-center gap-2'>
          <JobListItemBadge badge={badge} />
          {badge === JOB_ITEM_BADGE.URGENTLY_HIRING && (
            <EligibilityBadge jobId={job.id} />
          )}
        </div>
      )}

      <h1 className='text-2xl font-bold text-foreground'>{title}</h1>

      <JobListItemInfoTags tags={infoTags} />
    </header>
  );
};
