import { type JobDetailsSchema } from '@/features/jobs/schemas';
import { CtaCard } from './cta-card';
import { OrgInfoCard } from './org-info-card';
import { SimilarJobsCard } from './similar-jobs-card';

interface JobDetailsSidebarProps {
  job: JobDetailsSchema;
}

export const JobDetailsSidebar = ({ job }: JobDetailsSidebarProps) => {
  const { applyUrl, organization, similarJobs } = job;

  return (
    <div className='flex flex-col gap-4'>
      <CtaCard applyUrl={applyUrl} />
      {organization && <OrgInfoCard organization={organization} />}
      <SimilarJobsCard jobs={similarJobs} />
    </div>
  );
};
