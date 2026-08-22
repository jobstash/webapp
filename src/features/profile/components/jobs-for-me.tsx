'use client';

import Link from 'next/link';
import {
  AlertCircleIcon,
  RefreshCwIcon,
  SearchIcon,
  SettingsIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { JobListItem } from '@/features/jobs/components/job-list/job-list-item/job-list-item';
import { JobListItemSkeleton } from '@/features/jobs/components/job-list/job-list-item/job-list-item.skeleton';

import { ProfileCard } from './profile-card';
import { useJobsForMe } from '../hooks/use-jobs-for-me';

export const JobsForMe = () => {
  const { data = [], isPending, isError, refetch, isFetching } = useJobsForMe();

  if (isPending) {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 3 }).map((_, index) => (
          <JobListItemSkeleton key={index} />
        ))}
      </div>
    );
  }
  if (isError) {
    return (
      <ProfileCard title='Jobs for me'>
        <div className='flex flex-col items-center gap-3 py-6'>
          <AlertCircleIcon className='size-8 text-destructive' />
          <p className='text-center text-sm text-muted-foreground'>
            We could not check your matches.
          </p>
          <div className='flex gap-2'>
            <Button size='sm' onClick={() => refetch()} disabled={isFetching}>
              <RefreshCwIcon className='size-4' /> Retry
            </Button>
            <Button size='sm' variant='secondary' asChild>
              <Link href='/market'>Browse all jobs</Link>
            </Button>
          </div>
        </div>
      </ProfileCard>
    );
  }
  if (data.length === 0) {
    return (
      <ProfileCard title='Jobs for me'>
        <div className='flex flex-col items-center gap-3 py-6'>
          <SearchIcon className='size-8 text-muted-foreground/50' />
          <p className='text-center text-sm text-muted-foreground'>
            No current jobs have a work option that matches your saved
            preferences.
          </p>
          <div className='flex gap-2'>
            <Button size='sm' asChild>
              <Link href='/profile/settings#job-preferences'>
                <SettingsIcon className='size-4' /> Update preferences
              </Link>
            </Button>
            <Button size='sm' variant='secondary' asChild>
              <Link href='/market'>Browse all jobs</Link>
            </Button>
          </div>
        </div>
      </ProfileCard>
    );
  }

  return (
    <div className='space-y-4'>
      <ProfileCard title='Jobs for me'>
        <p className='text-sm text-muted-foreground'>
          Each result has at least one work option compatible with your
          preferences. Items marked “Needs checking” still have an unstated
          geographic or legal detail.
        </p>
      </ProfileCard>
      {data.map((match) => (
        <div key={match.job.id} className='space-y-2'>
          <JobListItem job={match.job} />
          <div className='rounded-xl border border-border/50 bg-card px-4 py-3 text-sm'>
            <p className='font-medium'>
              {match.confirmed
                ? 'Matches where you can work'
                : 'Needs checking'}
            </p>
            <p className='mt-1 text-muted-foreground'>{match.explanation}</p>
            {match.needsChecking.length > 0 && (
              <ul className='mt-2 list-disc space-y-1 pl-5 text-muted-foreground'>
                {match.needsChecking.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {match.optionalSignals.map((signal) => (
              <p key={signal} className='mt-2 text-xs text-muted-foreground'>
                {signal}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
