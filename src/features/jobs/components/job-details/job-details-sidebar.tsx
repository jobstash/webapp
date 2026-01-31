import { type JobDetailsSchema } from '@/features/jobs/schemas';
import { JOB_ITEM_BADGE } from '@/features/jobs/constants';
import { CtaCard } from './cta-card';
import { OrgInfoCard } from './org-info-card';
import { SimilarJobsCard } from './similar-jobs-card';

interface JobDetailsSidebarProps {
  job: JobDetailsSchema;
}

export const JobDetailsSidebar = ({ job }: JobDetailsSidebarProps) => {
  const { applyUrl, organization, similarJobs, badge } = job;
  const isExpertJob = badge === JOB_ITEM_BADGE.EXPERT;

  return (
    <div className='flex flex-col gap-4'>
      <CtaCard
        applyUrl={applyUrl}
        isExpertJob={isExpertJob}
        jobId={job.id}
        jobTitle={job.title}
        organization={organization?.name ?? null}
      />
      {organization && <OrgInfoCard organization={organization} />}
      <SimilarJobsCard jobs={similarJobs} />
    </div>
  );
};
