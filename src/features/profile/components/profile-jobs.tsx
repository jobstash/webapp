'use client';

import { TagsIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SimilarJobItem } from '@/features/jobs/components/job-details/similar-job-item';

import { ProfileCard } from './profile-card';
import { useProfileEditor } from './profile-editor-provider';
import { useSuggestedJobsCard } from './use-suggested-jobs-card';

const JobSkeleton = () => (
  <div className='flex items-start gap-2.5 p-2'>
    <Skeleton className='mt-0.5 size-8 shrink-0 rounded-md' />
    <div className='flex min-w-0 flex-1 flex-col gap-1.5'>
      <Skeleton className='h-4 w-3/4' />
      <Skeleton className='h-3 w-1/2' />
    </div>
  </div>
);

export const ProfileJobs = () => {
  const { openSkillsEditor } = useProfileEditor();
  const { jobs, isPending, hasSkills, isSkillsPending } =
    useSuggestedJobsCard();

  if (isSkillsPending) {
    return (
      <ProfileCard title='Jobs For You'>
        <div className='space-y-1'>
          {Array.from({ length: 8 }).map((_, i) => (
            <JobSkeleton key={i} />
          ))}
        </div>
      </ProfileCard>
    );
  }

  if (!hasSkills) {
    return (
      <ProfileCard title='Jobs For You'>
        <div className='flex flex-col items-center gap-3 py-6'>
          <TagsIcon className='size-8 text-muted-foreground/50' />
          <p className='text-center text-sm text-muted-foreground'>
            Add profile skills to unlock job matches
          </p>
          <Button size='sm' variant='secondary' onClick={openSkillsEditor}>
            Add Skills
          </Button>
        </div>
      </ProfileCard>
    );
  }

  if (isPending) {
    return (
      <ProfileCard title='Jobs For You'>
        <div className='space-y-1'>
          {Array.from({ length: 8 }).map((_, i) => (
            <JobSkeleton key={i} />
          ))}
        </div>
      </ProfileCard>
    );
  }

  return (
    <ProfileCard title='Jobs For You'>
      <div className='space-y-1'>
        {jobs.map((job) => (
          <SimilarJobItem key={job.id} job={job} target='_blank' />
        ))}
      </div>
    </ProfileCard>
  );
};
