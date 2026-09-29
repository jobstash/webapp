'use client';

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type TouchEvent,
} from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LinkWithLoader } from '@/components/link-with-loader';
import { cn } from '@/lib/utils';
import type { JobListItemSchema } from '@/features/jobs/schemas';
import type { JobStackTitle } from '@/features/jobs/job-stack';
import { JobListItem, JobListItemFrame } from './job-list-item';
import { useStackJob } from './use-stack-job';

interface JobStackProps {
  jobs: JobListItemSchema[];
  jobTitles: JobStackTitle[];
  importRunId: string | null;
}

export const JobStack = ({ jobs, jobTitles, importRunId }: JobStackProps) => {
  const [selectedId, setSelectedId] = useState(jobTitles[0].id);
  const found = jobTitles.findIndex((item) => item.id === selectedId);
  const index = Math.max(0, found);
  const selected = jobTitles[index];
  const { job, failed, prefetch } = useStackJob(selected.id, importRunId, jobs);
  const organization = jobs[0].organization;
  const strip = useRef<HTMLDivElement>(null);
  const activeTitle = useRef<HTMLButtonElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const previousHeight = useRef<number | undefined>(undefined);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const panelId = useId();
  const hasPager = jobTitles.length > 1;
  const navigationLabel = `Jobs at ${organization?.name ?? 'this organization'}`;
  const allJobsLabel = `All jobs at ${organization?.name ?? 'this organization'}`;
  const layers = Math.min(3, jobTitles.length - 1);
  const duplicateTitles = useMemo(() => {
    const counts = new Map<string, number>();
    jobTitles.forEach(({ title }) =>
      counts.set(title, (counts.get(title) ?? 0) + 1),
    );
    return new Set(
      [...counts].filter(([, count]) => count > 1).map(([title]) => title),
    );
  }, [jobTitles]);

  useEffect(() => {
    if (found < 0) setSelectedId(jobTitles[0].id);
  }, [found, jobTitles]);

  useEffect(() => {
    if (job && card.current)
      previousHeight.current = card.current.getBoundingClientRect().height;
  }, [job]);

  useEffect(() => {
    const element = strip.current;
    if (!element) return;
    const revealSelection = () => {
      const button = activeTitle.current;
      if (!button) return;
      const viewport = element.getBoundingClientRect();
      const bounds = button.getBoundingClientRect();
      const delta =
        bounds.left < viewport.left
          ? bounds.left - viewport.left
          : bounds.right > viewport.right
            ? bounds.right - viewport.right
            : 0;
      if (delta) element.scrollLeft += delta;
    };
    revealSelection();
    if (typeof ResizeObserver === 'undefined') return;
    let frame: number | undefined;
    const observer = new ResizeObserver(() => {
      revealSelection();
      // The title widths change with the strip. Recheck after the browser has
      // adjusted its horizontal scroll position for that new layout.
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(revealSelection);
    });
    observer.observe(element);
    if (activeTitle.current) observer.observe(activeTitle.current);
    return () => {
      observer.disconnect();
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, [selected.id, jobTitles]);

  const select = (position: number, focus = false) => {
    const next = Math.max(0, Math.min(jobTitles.length - 1, position));
    setSelectedId(jobTitles[next].id);
    if (focus)
      strip.current
        ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
        [next]?.focus({ preventScroll: true });
  };
  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (
      event.touches.length !== 1 ||
      target.closest(
        'a, button, input, textarea, select, [role="tablist"], [role="slider"], [contenteditable="true"]',
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
      select(index + (dx < 0 ? 1 : -1));
  };
  const footer = (
    <div className='flex min-w-0 flex-wrap items-center gap-x-2 border-t border-border/50 px-2 py-1 text-xs text-muted-foreground @xl:flex-nowrap @xl:px-3 @xl:text-sm'>
      {hasPager && (
        <nav
          aria-label={navigationLabel}
          className='flex min-w-0 basis-full items-center @xl:flex-1 @xl:basis-auto'
        >
          <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            className='h-11 w-8 shrink-0'
            aria-label='Previous job'
            disabled={index === 0}
            onMouseEnter={() => index > 0 && prefetch(jobTitles[index - 1].id)}
            onClick={() => select(index - 1)}
          >
            <ChevronLeftIcon />
          </Button>
          <div
            ref={strip}
            role='tablist'
            aria-label='Job titles'
            className='flex min-w-0 flex-1 touch-pan-x items-center gap-1 overflow-x-auto overscroll-x-contain [overflow-anchor:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
            onKeyDown={(event) => {
              const next =
                event.key === 'ArrowRight'
                  ? index + 1
                  : event.key === 'ArrowLeft'
                    ? index - 1
                    : event.key === 'Home'
                      ? 0
                      : event.key === 'End'
                        ? jobTitles.length - 1
                        : null;
              if (next !== null) {
                event.preventDefault();
                select(next, true);
              }
            }}
          >
            {jobTitles.map((item, position) => {
              const label =
                duplicateTitles.has(item.title) && item.location
                  ? `${item.title} · ${item.location}`
                  : item.title;
              return (
                <Button
                  key={item.id}
                  ref={position === index ? activeTitle : undefined}
                  id={`${panelId}-${position}`}
                  role='tab'
                  type='button'
                  variant='ghost'
                  aria-selected={position === index}
                  aria-controls={panelId}
                  tabIndex={position === index ? 0 : -1}
                  title={label}
                  onMouseEnter={() => prefetch(item.id)}
                  onFocus={() => prefetch(item.id)}
                  onClick={() => select(position)}
                  className={cn(
                    'h-11 max-w-[min(100%,22rem)] shrink-0 rounded-none border-b-2 px-3 text-xs @xl:text-sm',
                    position === index
                      ? 'border-foreground text-foreground'
                      : 'border-transparent text-muted-foreground',
                  )}
                >
                  <span className='truncate'>{label}</span>
                </Button>
              );
            })}
          </div>
          <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            className='h-11 w-8 shrink-0'
            aria-label='Next job'
            disabled={index === jobTitles.length - 1}
            onMouseEnter={() =>
              index < jobTitles.length - 1 && prefetch(jobTitles[index + 1].id)
            }
            onClick={() => select(index + 1)}
          >
            <ChevronRightIcon />
          </Button>
        </nav>
      )}
      {hasPager && (
        <span
          role='status'
          aria-live='polite'
          aria-atomic='true'
          className='shrink-0 pl-2 whitespace-nowrap tabular-nums @xl:pl-0'
        >
          <span className='sr-only'>{selected.title}, </span>
          {index + 1} of {jobTitles.length}
        </span>
      )}
      {organization && (
        <Button
          asChild
          variant='ghost'
          size='sm'
          className='ml-auto h-8 max-w-[75%] min-w-0 px-2 text-xs @xl:max-w-[30%] @xl:text-sm'
        >
          <LinkWithLoader href={organization.href} aria-label={allJobsLabel}>
            <span className='truncate'>All jobs at {organization.name}</span>
            <ArrowRightIcon className='shrink-0' />
          </LinkWithLoader>
        </Button>
      )}
    </div>
  );
  return (
    <div
      className='@container relative isolate min-w-0'
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
        className='relative min-w-0'
        onTouchStart={onTouchStart}
        onTouchMove={(event) => {
          if (event.touches.length !== 1) gesture.current = null;
        }}
        onTouchEnd={onTouchEnd}
        onTouchCancel={() => {
          gesture.current = null;
        }}
      >
        <JobListItemFrame>
          <div
            ref={card}
            id={panelId}
            role={hasPager ? 'tabpanel' : undefined}
            aria-labelledby={hasPager ? `${panelId}-${index}` : undefined}
            className='touch-pan-y'
          >
            {job ? (
              <JobListItem job={job} contentOnly />
            ) : (
              <div
                className='space-y-3 p-5'
                style={{ minHeight: previousHeight.current }}
                aria-busy={!failed}
              >
                <p className='text-xs text-muted-foreground'>
                  {organization?.name}
                </p>
                <h2 className='text-lg font-semibold'>{selected.title}</h2>
                <p className='text-sm text-muted-foreground'>
                  {failed
                    ? 'Open the job page to see the details.'
                    : 'Loading job details…'}
                </p>
                {failed && (
                  <LinkWithLoader
                    href={selected.href}
                    className='inline-flex text-sm underline underline-offset-4'
                  >
                    View job details
                    <ArrowRightIcon className='ml-2 size-4' />
                  </LinkWithLoader>
                )}
              </div>
            )}
          </div>
          {footer}
        </JobListItemFrame>
      </div>
    </div>
  );
};
