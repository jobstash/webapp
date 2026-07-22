import { type JobDetailsSchema } from '@/features/jobs/schemas';
import { JOB_ITEM_BADGE } from '@/features/jobs/constants';
import { JobDetailsHeader } from './job-details-header';
import { JobDetailsContent } from './job-details-content';
import { JobDetailsSidebar } from './job-details-sidebar';
import { MobileApplyBar } from './mobile-apply-bar';
import { OrgInfoCard } from './org-info-card';
import { JobViewTracker } from './job-view-tracker';

interface JobDetailsPageProps {
  job: JobDetailsSchema;
}

export const JobDetailsPage = ({ job }: JobDetailsPageProps) => {
  const isExpertJob = job.badge === JOB_ITEM_BADGE.URGENTLY_HIRING;
  const orgName = job.organization?.name ?? null;

  return (
    <>
      <JobViewTracker shortUUID={job.id} />
      <main className='pb-24 lg:pb-8'>
        <div className='flex gap-6'>
          <article className='min-w-0 flex-1'>
            <div className='rounded-2xl border border-neutral-800/50 bg-sidebar p-3 pt-4 md:p-6 md:pt-6'>
              <JobDetailsHeader job={job} />
              {/* Below lg the sidebar is hidden — surface the company info
                  right under the header instead of at the page bottom */}
              {job.organization && (
                <div className='mt-6 lg:hidden'>
                  <OrgInfoCard organization={job.organization} />
                </div>
              )}
              <JobDetailsContent job={job} tags={job.tags} />
            </div>
          </article>

          {/* Normal flow, natural height — the enriched org card makes this
              column taller than the viewport, and an inner scrollbar (sticky
              + max-h + overflow) reads as broken next to the article */}
          <aside className='hidden w-80 shrink-0 flex-col gap-4 self-start lg:flex'>
            <JobDetailsSidebar job={job} isExpertJob={isExpertJob} />
          </aside>
        </div>

        <div className='mt-6 space-y-4 lg:hidden'>
          <JobDetailsSidebar job={job} isExpertJob={isExpertJob} hideOrgCard />
        </div>
      </main>

      <MobileApplyBar
        hasApplyUrl={job.hasApplyUrl}
        isExpertJob={isExpertJob}
        jobId={job.id}
        jobTitle={job.title}
        organization={orgName}
        classification={job.classification}
      />
    </>
  );
};
