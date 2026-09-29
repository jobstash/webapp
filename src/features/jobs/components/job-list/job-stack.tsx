'use client';

import { useEffect, useMemo, useRef, useState, type TouchEvent } from 'react';
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
  const [capacity, setCapacity] = useState(5);
  const hasPager = jobs.length > 1;
  const pager = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const visibleJobs = useMemo(() => jobs.slice(0, capacity), [jobs, capacity]);
  const [selectedId, setSelectedId] = useState(jobs[0].id);
  useEffect(() => {
    const element = pager.current;
    if (!element || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => {
      // Each dot keeps a 24px target. Measure the space left after the other controls.
      setCapacity(
        Math.max(1, Math.min(25, Math.floor(entry.contentRect.width / 24))),
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [hasPager]);
  const found = visibleJobs.findIndex((job) => job.id === selectedId);
  const index =
    found < 0
      ? Math.min(
          jobs.findIndex((item) => item.id === selectedId),
          visibleJobs.length - 1,
        )
      : found;
  const safeIndex = Math.max(0, index);
  useEffect(() => {
    if (!visibleJobs.some((item) => item.id === selectedId))
      setSelectedId(visibleJobs[safeIndex].id);
  }, [visibleJobs, selectedId, safeIndex]);
  const job = visibleJobs[safeIndex];
  const layers = Math.min(3, visibleJobs.length - 1);
  const allJobsLabel = `View all jobs at ${job.organization?.name ?? 'this organization'}`;
  const navigationLabel = `Jobs at ${job.organization?.name ?? 'this organization'}`;
  const positionLabel = (position: number) =>
    `Show job ${position + 1} of ${visibleJobs.length}`;
  const select = (position: number) =>
    setSelectedId(
      visibleJobs[Math.max(0, Math.min(visibleJobs.length - 1, position))].id,
    );
  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (
      event.touches.length !== 1 ||
      target.closest(
        'a, button, input, textarea, select, [role="slider"], [contenteditable="true"]',
      )
    ) {
      gesture.current = null;
      return;
    }
    gesture.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  };
  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = gesture.current;
    gesture.current = null;
    if (!start || event.changedTouches.length !== 1) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.5)
      select(safeIndex + (dx < 0 ? 1 : -1));
  };
  const footer = (
    <div className='flex items-center gap-1 border-t border-border/50 px-2 py-1 text-xs text-muted-foreground sm:gap-2 sm:px-3 sm:text-sm'>
      {hasPager && (
        <nav
          aria-label={navigationLabel}
          className='flex min-w-0 flex-1 items-center gap-0.5'
        >
          <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            className='size-7 shrink-0'
            aria-label='Previous job'
            disabled={safeIndex === 0}
            onClick={() => select(safeIndex - 1)}
          >
            <ChevronLeftIcon />
          </Button>
          <div
            ref={pager}
            className='flex min-w-0 flex-1 justify-between overflow-hidden'
          >
            {visibleJobs.map((item, position) => (
              <Button
                key={item.id}
                type='button'
                variant='ghost'
                size='icon-xs'
                className='size-6 shrink-0'
                aria-label={positionLabel(position)}
                aria-current={safeIndex === position ? 'true' : undefined}
                onClick={() => select(position)}
              >
                <span
                  className={cn(
                    'size-2 rounded-full',
                    safeIndex === position
                      ? 'bg-foreground'
                      : 'bg-muted-foreground/50',
                  )}
                />
              </Button>
            ))}
          </div>
          <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            className='size-7 shrink-0'
            aria-label='Next job'
            disabled={safeIndex === visibleJobs.length - 1}
            onClick={() => select(safeIndex + 1)}
          >
            <ChevronRightIcon />
          </Button>
          <span
            role='status'
            aria-live='polite'
            aria-atomic='true'
            className='mx-1 shrink-0 whitespace-nowrap tabular-nums'
          >
            {safeIndex + 1} of {visibleJobs.length}
          </span>
        </nav>
      )}
      {job.organization && (
        <Button
          asChild
          variant='ghost'
          size='sm'
          className='ml-auto h-8 max-w-[40%] min-w-0 shrink-0 px-1 text-xs sm:px-2 sm:text-sm'
        >
          <LinkWithLoader
            href={job.organization.href}
            aria-label={allJobsLabel}
          >
            <span className='@sm:hidden'>All jobs</span>
            <span className='hidden truncate @sm:inline'>
              View all jobs at {job.organization.name}
            </span>
            <ArrowRightIcon className='shrink-0' />
          </LinkWithLoader>
        </Button>
      )}
    </div>
  );
  return (
    <div
      className='@container relative isolate'
      style={{ paddingBottom: layers * 3 }}
    >
      {Array.from({ length: layers }, (_, i) => layers - i).map((layer) => (
        <div
          key={layer}
          aria-hidden='true'
          className='pointer-events-none absolute rounded-2xl border border-border/50 bg-card shadow-sm'
          style={{
            insetInline: layer * 3,
            top: layer * 3,
            bottom: (layers - layer) * 3,
          }}
        />
      ))}
      <div
        className='relative touch-pan-y'
        onTouchStart={onTouchStart}
        onTouchMove={(event) => {
          if (event.touches.length !== 1) gesture.current = null;
        }}
        onTouchEnd={onTouchEnd}
        onTouchCancel={() => {
          gesture.current = null;
        }}
      >
        <JobListItem job={job} footer={footer} />
      </div>
    </div>
  );
};
