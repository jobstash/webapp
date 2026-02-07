'use client';

import { ArrowRightIcon, LockIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LinkWithLoader } from '@/components/link-with-loader';
import { useSession } from '@/features/auth/hooks/use-session';
import { useProfileSkills } from '@/features/profile/hooks/use-profile-skills';
import { useJobsForYou } from '@/features/profile/hooks/use-jobs-for-you';

import type { MatchedJob } from '../../hooks/use-jobs-for-you';
import { JobMatchCard } from './job-match-card';

const JobsForYouContent = ({
  hasSkills,
  isPending,
  jobs,
}: {
  hasSkills: boolean;
  isPending: boolean;
  jobs: MatchedJob[] | undefined;
}) => {
  if (!hasSkills) return <LockedState />;

  if (isPending) {
    return (
      <div className='flex flex-col gap-2'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className='h-16 w-full rounded-lg' />
        ))}
      </div>
    );
  }

  if (jobs && jobs.length > 0) {
    return (
      <div className='flex flex-col gap-2'>
        {jobs.map((job) => (
          <JobMatchCard key={job.shortUuid} job={job} />
        ))}
      </div>
    );
  }

  return (
    <p className='text-sm text-muted-foreground'>
      No matched jobs right now — check back later
    </p>
  );
};

const PlaceholderCard = () => (
  <div className='flex items-center gap-3 rounded-lg border border-border p-3'>
    <div className='size-9 shrink-0 rounded-md bg-accent' />
    <div className='flex grow flex-col gap-1.5'>
      <div className='h-3.5 w-3/4 rounded bg-muted-foreground/10' />
      <div className='h-3 w-1/2 rounded bg-muted-foreground/10' />
    </div>
    <div className='h-6 w-20 rounded-md bg-muted-foreground/10' />
  </div>
);

const LockedState = () => (
  <div className='relative'>
    <div className='flex flex-col gap-2 blur-[6px] select-none' aria-hidden>
      <PlaceholderCard />
      <PlaceholderCard />
      <PlaceholderCard />
    </div>

    <div
      className={cn(
        'absolute inset-0 flex flex-col items-center justify-center gap-3',
        'rounded-lg bg-background/60 backdrop-blur-xs',
      )}
    >
      <div className='flex size-10 items-center justify-center rounded-full bg-accent ring-1 ring-border'>
        <LockIcon className='size-4 text-muted-foreground' />
      </div>
      <div className='flex flex-col items-center gap-1 text-center'>
        <p className='text-sm font-medium'>Add your skills to unlock</p>
        <p className='text-sm text-muted-foreground'>
          personalized job matches
        </p>
      </div>
      <Button asChild size='sm'>
        <LinkWithLoader href='/profile'>Add Skills</LinkWithLoader>
      </Button>
    </div>
  </div>
);

export const JobsForYou = () => {
  const { isSessionReady } = useSession();
  const { data: skills } = useProfileSkills(isSessionReady);
  const hasSkills = (skills ?? []).length > 0;
  const { data: jobs, isPending } = useJobsForYou(isSessionReady && hasSkills);

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center gap-2'>
        {!hasSkills && <LockIcon className='size-4 text-muted-foreground' />}
        <h2 className='text-lg font-semibold'>Jobs For You</h2>
      </div>

      <JobsForYouContent
        hasSkills={hasSkills}
        isPending={isPending}
        jobs={jobs}
      />

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
