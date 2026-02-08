'use client';

import { useRef, useState } from 'react';
import { TagsIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { type SimilarJobSchema } from '@/features/jobs/schemas';
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

const ScrollableJobList = ({ jobs }: { jobs: SimilarJobSchema[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleScroll = () => {
    const el = ref.current;
    if (!el) return;
    setIsAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 8);
  };

  return (
    <div className='relative'>
      <div
        ref={ref}
        onScroll={handleScroll}
        className={cn(CARD_HEIGHT, 'space-y-1 overflow-y-auto')}
      >
        {jobs.map((job) => (
          <SimilarJobItem key={job.id} job={job} target='_blank' />
        ))}
      </div>
      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-sidebar to-transparent transition-opacity',
          isAtBottom ? 'opacity-0' : 'opacity-100',
        )}
      />
    </div>
  );
};

export const SuggestedJobsCard = () => {
  const { jobs, isPending, hasSkills, isSkillsPending } =
    useSuggestedJobsCard();

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
        <ScrollableJobList jobs={jobs} />
      )}
    </div>
  );
};
