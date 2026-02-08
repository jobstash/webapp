'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { TagsIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { GA_EVENT, trackEvent } from '@/lib/analytics';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { type JobListItemSchema } from '@/features/jobs/schemas';

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

const LINK_CLASS = cn(
  'flex items-start gap-2.5 rounded-lg p-2',
  'transition-colors hover:bg-muted/50',
);

const FALLBACK_CLASS = cn(
  'mt-0.5 flex size-8 items-center justify-center rounded-md',
  'bg-linear-to-br from-muted to-muted/50',
  'text-xs font-medium text-muted-foreground',
  'ring-1 ring-border/50',
);

const CompactJobItem = ({ job }: { job: JobListItemSchema }) => {
  const { title, href, timestampText, organization } = job;
  const companyName = organization?.name ?? null;
  const companyLogo = organization?.logo ?? null;
  const subtitle = [companyName, timestampText].filter(Boolean).join(' · ');

  const handleClick = () => {
    trackEvent(GA_EVENT.JOB_CARD_CLICKED, {
      job_id: job.id,
      job_title: title,
      organization: companyName ?? '',
    });
  };

  return (
    <Link
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      onClick={handleClick}
      className={LINK_CLASS}
    >
      <ImageWithFallback
        src={companyLogo ?? ''}
        alt={companyName ?? 'Company'}
        width={32}
        height={32}
        className='mt-0.5 shrink-0 rounded-md ring-1 ring-border/50'
        fallback={
          <div className={FALLBACK_CLASS}>
            {companyName?.charAt(0).toUpperCase() ?? '?'}
          </div>
        }
      />
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-medium text-foreground'>{title}</p>
        {subtitle && (
          <p className='truncate text-xs text-muted-foreground'>{subtitle}</p>
        )}
      </div>
    </Link>
  );
};

const ScrollableJobList = ({ jobs }: { jobs: JobListItemSchema[] }) => {
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
          <CompactJobItem key={job.id} job={job} />
        ))}
      </div>
      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-sidebar to-transparent transition-opacity',
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
        <h3 className='mb-3 font-medium'>Jobs For You</h3>
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
        <h3 className='mb-3 font-medium'>Jobs For You</h3>
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
      <h3 className='mb-3 font-medium'>Jobs For You</h3>

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
