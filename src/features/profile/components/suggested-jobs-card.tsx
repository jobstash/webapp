'use client';

import { ChevronDownIcon, TagsIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SimilarJobItem } from '@/features/jobs/components/job-details/similar-job-item';

import { useSuggestedJobsCard } from './use-suggested-jobs-card';

const CARD_HEIGHT = 'h-[320px]';

const JobSkeleton = () => (
  <div className='flex items-start gap-2.5 p-2'>
    <Skeleton className='mt-0.5 size-8 shrink-0 rounded-md' />
    <div className='flex min-w-0 flex-1 flex-col gap-1.5'>
      <Skeleton className='h-4 w-3/4' />
      <Skeleton className='h-3 w-1/2' />
    </div>
  </div>
);

export const SuggestedJobsCard = () => {
  const {
    jobs,
    isPending,
    hasSkills,
    isSkillsPending,
    isExpanded,
    toggleExpanded,
  } = useSuggestedJobsCard();

  // Still loading skills — show skeleton to avoid empty-state flash
  if (isSkillsPending) {
    return (
      <div className='rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
        <h3 className='mb-3 font-medium'>Your Job Matches</h3>
        <div className={cn(CARD_HEIGHT, 'space-y-1')}>
          {Array.from({ length: 5 }).map((_, i) => (
            <JobSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!hasSkills) {
    return (
      <div className='rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
        <h3 className='mb-3 font-medium'>Your Job Matches</h3>
        <div className='flex flex-col items-center gap-3 py-6'>
          <TagsIcon className='size-8 text-muted-foreground/50' />
          <p className='text-center text-sm text-muted-foreground'>
            Add profile skills to unlock job matches
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
      <h3 className='mb-3 font-medium'>Your Job Matches</h3>

      {isPending ? (
        <div className={cn(CARD_HEIGHT, 'space-y-1')}>
          {Array.from({ length: 5 }).map((_, i) => (
            <JobSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className='relative'>
            <div
              className={cn(
                'space-y-1',
                isExpanded
                  ? 'max-h-[480px] overflow-y-auto'
                  : cn(CARD_HEIGHT, 'overflow-hidden'),
              )}
            >
              {jobs.map((job) => (
                <SimilarJobItem key={job.id} job={job} target='_blank' />
              ))}
            </div>

            {!isExpanded && jobs.length > 3 && (
              <div className='pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-sidebar to-transparent' />
            )}
          </div>

          {jobs.length > 3 && (
            <Button
              variant='ghost'
              size='sm'
              className='mt-2 w-full text-muted-foreground'
              onClick={toggleExpanded}
            >
              {isExpanded ? 'Show less' : 'Show all'}
              <ChevronDownIcon
                className={cn(
                  'size-3.5 transition-transform',
                  isExpanded && 'rotate-180',
                )}
              />
            </Button>
          )}
        </>
      )}
    </div>
  );
};
