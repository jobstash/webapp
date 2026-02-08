'use client';

import { Loader2Icon, TagsIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { JobListItem } from '@/features/jobs/components/job-list/job-list-item/job-list-item';
import { JobListItemSkeleton } from '@/features/jobs/components/job-list/job-list-item/job-list-item.skeleton';

import { ProfileCard } from './profile-card';
import { useProfileEditor } from './profile-editor-provider';
import { useSuggestedJobsCard } from './use-suggested-jobs-card';

export const ProfileJobs = () => {
  const { openSkillsEditor } = useProfileEditor();
  const {
    jobs,
    isPending,
    hasSkills,
    isSkillsPending,
    hasMore,
    fetchNextPage,
    isFetchingNextPage,
  } = useSuggestedJobsCard();

  if (isSkillsPending) {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <JobListItemSkeleton key={i} />
        ))}
      </div>
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
      <div className='space-y-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <JobListItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {jobs.map((job) => (
        <JobListItem key={job.id} job={job} />
      ))}

      {hasMore && (
        <Button
          variant='ghost'
          className='w-full'
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? (
            <>
              <Loader2Icon className='size-4 animate-spin' />
              Loading...
            </>
          ) : (
            'Load More'
          )}
        </Button>
      )}
    </div>
  );
};
