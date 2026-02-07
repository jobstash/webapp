'use client';

import { LoaderIcon } from 'lucide-react';

import { SimilarJobItem } from '@/features/jobs/components/job-details/similar-job-item';

import { useSuggestedJobsCard } from './use-suggested-jobs-card';

export const SuggestedJobsCard = () => {
  const { jobs, isPending, isEmpty } = useSuggestedJobsCard();

  if (isEmpty) return null;

  return (
    <div className='rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
      <h3 className='mb-3 font-medium'>Your Job Matches</h3>

      {isPending ? (
        <div className='flex h-[400px] items-center justify-center'>
          <LoaderIcon className='size-5 animate-spin text-muted-foreground' />
        </div>
      ) : (
        <div className='h-[400px] space-y-1 overflow-y-auto'>
          {jobs.map((job) => (
            <SimilarJobItem key={job.id} job={job} target='_blank' />
          ))}
        </div>
      )}
    </div>
  );
};
