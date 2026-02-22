import { type JobDetailsSchema } from '@/features/jobs/schemas';
import { CtaCard } from './cta-card';
import { OrgInfoCard } from './org-info-card';
import { SimilarJobsCard } from './similar-jobs-card';

interface JobDetailsSidebarProps {
  job: JobDetailsSchema;
  isExpertJob: boolean;
}

export const JobDetailsSidebar = ({
  job,
  isExpertJob,
}: JobDetailsSidebarProps) => {
  const { hasApplyUrl, organization, similarJobs } = job;

  return (
    <div className='flex flex-col gap-4'>
      <CtaCard
        hasApplyUrl={hasApplyUrl}
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
