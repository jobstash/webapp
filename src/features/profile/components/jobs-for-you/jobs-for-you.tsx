'use client';

import { ArrowRightIcon, BriefcaseIcon } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { LinkWithLoader } from '@/components/link-with-loader';
import { useSession } from '@/features/auth/hooks/use-session';
import { useProfileSkills } from '@/features/profile/hooks/use-profile-skills';
import { useJobsForYou } from '@/features/profile/hooks/use-jobs-for-you';

import { JobMatchCard } from './job-match-card';

export const JobsForYou = () => {
  const { isSessionReady } = useSession();
  const { data: skills } = useProfileSkills(isSessionReady);
  const hasSkills = (skills ?? []).length > 0;
  const { data: jobs, isPending } = useJobsForYou(isSessionReady && hasSkills);

  return (
    <div className='flex flex-col gap-3'>
      <h2 className='text-lg font-semibold'>Jobs For You</h2>

      {isPending && hasSkills ? (
        <div className='flex flex-col gap-2'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-16 w-full rounded-lg' />
          ))}
        </div>
      ) : !hasSkills ? (
        <div className='flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-8'>
          <BriefcaseIcon className='size-8 text-muted-foreground/50' />
          <p className='text-sm text-muted-foreground'>
            Add skills above to see matched jobs
          </p>
        </div>
      ) : jobs && jobs.length > 0 ? (
        <div className='flex flex-col gap-2'>
          {jobs.map((job) => (
            <JobMatchCard key={job.shortUuid} job={job} />
          ))}
        </div>
      ) : (
        <p className='text-sm text-muted-foreground'>
          No matched jobs right now — check back later
        </p>
      )}

      <LinkWithLoader
        href='/'
        className='inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground'
      >
        Browse all jobs
        <ArrowRightIcon className='size-3' />
      </LinkWithLoader>
    </div>
  );
};
