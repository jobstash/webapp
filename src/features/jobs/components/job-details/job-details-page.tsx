import { type JobDetailsSchema } from '@/features/jobs/schemas';
import { JOB_ITEM_BADGE } from '@/features/jobs/constants';
import { JobDetailsHeader } from './job-details-header';
import { JobDetailsContent } from './job-details-content';
import { JobDetailsSidebar } from './job-details-sidebar';
import { MobileApplyBar } from './mobile-apply-bar';

interface JobDetailsPageProps {
  job: JobDetailsSchema;
}

export const JobDetailsPage = ({ job }: JobDetailsPageProps) => {
  const isExpertJob = job.badge === JOB_ITEM_BADGE.URGENTLY_HIRING;
  const orgName = job.organization?.name ?? null;

  return (
    <>
      <main className='pb-24 lg:pb-8'>
        <div className='flex gap-6'>
          <article className='min-w-0 flex-1'>
            <div className='rounded-2xl border border-neutral-800/50 bg-sidebar p-3 pt-4 md:p-6 md:pt-6'>
              <JobDetailsHeader job={job} />
              <JobDetailsContent job={job} tags={job.tags} />
            </div>
          </article>

          <aside className='sticky top-20 hidden max-h-[calc(100vh-5rem)] w-80 shrink-0 flex-col gap-4 self-start overflow-y-auto lg:top-24 lg:flex lg:max-h-[calc(100vh-6rem)]'>
            <JobDetailsSidebar job={job} isExpertJob={isExpertJob} />
          </aside>
        </div>

        <div className='mt-6 space-y-4 lg:hidden'>
          <JobDetailsSidebar job={job} isExpertJob={isExpertJob} />
        </div>
      </main>

      <MobileApplyBar
        applyUrl={job.applyUrl}
        isExpertJob={isExpertJob}
        jobId={job.id}
        jobTitle={job.title}
        organization={orgName}
      />
    </>
  );
};
