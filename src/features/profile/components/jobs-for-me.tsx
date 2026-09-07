'use client';

import { useEffect, useRef, useState } from 'react';
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
  rankingVersion,
}: {
  item: RecommendedJob;
  position: number;
  rankingVersion: string;
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
            void recordRecommendedJobImpression(
              item.job.id,
              position,
              rankingVersion,
            ).catch(() => undefined);
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
  }, [item.job.id, position, rankingVersion]);

  return (
    <div ref={ref} className='space-y-2'>
      <JobListItem job={item.job} />
      <div className='flex justify-end px-1 text-xs text-muted-foreground'>
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
  const [page, setPage] = useState(1);
  const { data, isPending, isError, refetch, isFetching } =
    useRecommendedJobs(page);

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
          <p className='text-sm text-muted-foreground'>
            {page === 1 ? 'No matches yet.' : 'No matches on this page.'}
          </p>
          {page > 1 && (
            <Button size='sm' variant='secondary' onClick={() => setPage(1)}>
              Back to first page
            </Button>
          )}
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
        <Recommendation
          key={`${data.rankingVersion}:${item.job.id}`}
          item={item}
          position={(page - 1) * 30 + index}
          rankingVersion={data.rankingVersion}
        />
      ))}
      <nav
        aria-label='Recommendation pages'
        className='flex items-center justify-between gap-3'
      >
        <Button
          variant='secondary'
          disabled={page === 1 || isFetching}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <span className='text-sm text-muted-foreground'>
          Page {page} · {data.total} matches
        </span>
        <Button
          variant='secondary'
          disabled={!data.hasMore || isFetching}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </nav>
    </div>
  );
};
