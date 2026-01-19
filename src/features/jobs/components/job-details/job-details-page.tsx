import { type JobDetailsSchema } from '@/features/jobs/schemas';
import { JobDetailsHeader } from './job-details-header';
import { JobDetailsContent } from './job-details-content';
import { JobDetailsTechTags } from './job-details-tech-tags';
import { JobDetailsSidebar } from './job-details-sidebar';
import { MobileApplyBar } from './mobile-apply-bar';

interface JobDetailsPageProps {
  job: JobDetailsSchema;
}

export const JobDetailsPage = ({ job }: JobDetailsPageProps) => {
  return (
    <>
      <main className='pb-24 lg:pb-8'>
        <div className='flex gap-6'>
          <article className='min-w-0 flex-1'>
            <div className='rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
              <JobDetailsHeader job={job} />
              <JobDetailsContent job={job} />
              <JobDetailsTechTags tags={job.tags} />
            </div>
          </article>

          <aside className='sticky top-20 hidden max-h-[calc(100vh-5rem)] w-80 shrink-0 flex-col gap-4 self-start overflow-y-auto lg:top-24 lg:flex lg:max-h-[calc(100vh-6rem)]'>
            <JobDetailsSidebar job={job} />
          </aside>
        </div>

        <div className='mt-6 space-y-4 lg:hidden'>
          <JobDetailsSidebar job={job} />
        </div>
      </main>

      <MobileApplyBar applyUrl={job.applyUrl} />
    </>
  );
};
