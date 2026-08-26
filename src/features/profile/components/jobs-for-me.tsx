'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  AlertCircleIcon,
  EyeOffIcon,
  RefreshCwIcon,
  SearchIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { JobListItem } from '@/features/jobs/components/job-list/job-list-item/job-list-item';
import { JobListItemSkeleton } from '@/features/jobs/components/job-list/job-list-item/job-list-item.skeleton';
import {
  recordRecommendedJobImpression,
  useDismissRecommendedJob,
  useRecommendedJobs,
} from '../hooks/use-recommended-jobs';
import type { RecommendedJob } from '../recommended-jobs';
import { ProfileCard } from './profile-card';

const Recommendation = ({
  item,
  position,
}: {
  item: RecommendedJob;
  position: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const tracked = useRef(false);
  const dismiss = useDismissRecommendedJob();

  useEffect(() => {
    const element = ref.current;
    if (!element || tracked.current) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          timer ??= setTimeout(() => {
            tracked.current = true;
            observer.disconnect();
            void recordRecommendedJobImpression(item.job.id, position).catch(
              () => undefined,
            );
          }, 1000);
        } else if (timer) {
          clearTimeout(timer);
          timer = undefined;
        }
      },
      { threshold: [0.6] },
    );
    observer.observe(element);
    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [item.job.id, position]);

  return (
    <div ref={ref} className='space-y-2'>
      <JobListItem job={item.job} />
      <div className='flex items-center justify-between gap-3 px-1 text-xs text-muted-foreground'>
        <span>{item.reason}</span>
        <Button
          type='button'
          size='sm'
          variant='ghost'
          className='h-7 px-2 text-xs'
          disabled={dismiss.isPending}
          onClick={() => dismiss.mutate(item.job.id)}
        >
          <EyeOffIcon className='size-3.5' /> Hide
        </Button>
      </div>
    </div>
  );
};

export const JobsForMe = () => {
  const { data, isPending, isError, refetch, isFetching } =
    useRecommendedJobs();

  if (isPending) {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 3 }).map((_, index) => (
          <JobListItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <ProfileCard title='Jobs for me'>
        <div className='flex flex-col items-center gap-3 py-6'>
          <AlertCircleIcon className='size-8 text-destructive' />
          <p className='text-sm text-muted-foreground'>
            Couldn&apos;t load matches.
          </p>
          <Button size='sm' onClick={() => refetch()} disabled={isFetching}>
            <RefreshCwIcon className='size-4' /> Try again
          </Button>
        </div>
      </ProfileCard>
    );
  }

  if (data.jobs.length === 0) {
    return (
      <ProfileCard title='Jobs for me'>
        <div className='flex flex-col items-center gap-3 py-6'>
          <SearchIcon className='size-8 text-muted-foreground/50' />
          <p className='text-sm text-muted-foreground'>No matches yet.</p>
          <Button size='sm' variant='secondary' asChild>
            <Link href='/'>Browse jobs</Link>
          </Button>
        </div>
      </ProfileCard>
    );
  }

  return (
    <div className='space-y-5'>
      {data.jobs.map((item, index) => (
        <Recommendation key={item.job.id} item={item} position={index} />
      ))}
    </div>
  );
};
