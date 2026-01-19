import { type JobDetailsSchema } from '@/features/jobs/schemas';
import { JobListItemBadge } from '@/features/jobs/components/job-list/job-list-item/job-list-item-badge';
import { JobListItemInfoTags } from '@/features/jobs/components/job-list/job-list-item/job-list-item-info-tags';
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
        <div className='flex'>
          <JobListItemBadge badge={badge} />
        </div>
      )}

      <h1 className='text-xl font-semibold text-foreground'>{title}</h1>

      <JobListItemInfoTags tags={infoTags} maxVisible={infoTags.length} />
    </header>
  );
};
