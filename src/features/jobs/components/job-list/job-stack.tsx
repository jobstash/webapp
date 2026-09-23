'use client';

import { useEffect, useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LinkWithLoader } from '@/components/link-with-loader';
import { cn } from '@/lib/utils';
import type { JobListItemSchema } from '@/features/jobs/schemas';
import { JobListItem } from './job-list-item';

export const JobStack = ({ jobs }: { jobs: JobListItemSchema[] }) => {
  const [selectedId, setSelectedId] = useState(jobs[0].id);
  const found = jobs.findIndex((job) => job.id === selectedId);
  const index = found < 0 ? 0 : found;
  useEffect(() => {
    if (!jobs.some((item) => item.id === selectedId)) setSelectedId(jobs[0].id);
  }, [jobs, selectedId]);
  const job = jobs[index];
  const layers = jobs.length - 1;
  const navigationLabel = `Jobs at ${job.organization?.name ?? 'this organization'}`;
  const positionLabel = (position: number) =>
    `Show job ${position + 1} of ${jobs.length}`;
  const select = (position: number) => setSelectedId(jobs[position].id);
  const footer = (
    <div className='flex flex-wrap items-center justify-between gap-2 border-t border-border/50 px-4 py-2 text-sm text-muted-foreground'>
      {jobs.length > 1 && (
        <nav aria-label={navigationLabel} className='flex items-center gap-1'>
          <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            aria-label='Previous job'
            disabled={index === 0}
            onClick={() => select(index - 1)}
          >
            <ChevronLeftIcon />
          </Button>
          {jobs.map((item, position) => (
            <Button
              key={item.id}
              type='button'
              variant='ghost'
              size='icon-xs'
              aria-label={positionLabel(position)}
              aria-current={index === position ? 'true' : undefined}
              onClick={() => select(position)}
            >
              <span
                className={cn(
                  'size-2 rounded-full',
                  index === position
                    ? 'bg-foreground'
                    : 'bg-muted-foreground/50',
                )}
              />
            </Button>
          ))}
          <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            aria-label='Next job'
            disabled={index === jobs.length - 1}
            onClick={() => select(index + 1)}
          >
            <ChevronRightIcon />
          </Button>
          <span
            role='status'
            aria-live='polite'
            aria-atomic='true'
            className='ml-1 tabular-nums'
          >
            {index + 1} of {jobs.length}
          </span>
        </nav>
      )}
      {job.organization && (
        <Button
          asChild
          variant='ghost'
          size='sm'
          className='ml-auto h-auto max-w-full py-2 text-right whitespace-normal'
        >
          <LinkWithLoader href={job.organization.href}>
            View all jobs at {job.organization.name}
            <ArrowRightIcon className='shrink-0' />
          </LinkWithLoader>
        </Button>
      )}
    </div>
  );
  return (
    <div className='relative isolate' style={{ paddingBottom: layers * 4 }}>
      {Array.from({ length: layers }, (_, i) => layers - i).map((layer) => (
        <div
          key={layer}
          aria-hidden='true'
          className='pointer-events-none absolute rounded-2xl border border-border/50 bg-card shadow-sm'
          style={{
            insetInline: layer * 4,
            top: layer * 4,
            bottom: (layers - layer) * 4,
          }}
        />
      ))}
      <div className='relative'>
        <JobListItem job={job} footer={footer} />
      </div>
    </div>
  );
};
