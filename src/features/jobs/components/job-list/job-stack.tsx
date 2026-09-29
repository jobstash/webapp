'use client';

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type TouchEvent,
  type PointerEvent,
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
  const gesture = useRef<{
    x: number;
    y: number;
    horizontal: boolean;
    prefetchedDirection: number;
  } | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [swipePhase, setSwipePhase] = useState<
    'idle' | 'dragging' | 'entering' | 'settling'
  >('idle');
  const swipeFrame = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      if (swipeFrame.current !== undefined)
        cancelAnimationFrame(swipeFrame.current);
    },
    [],
  );
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
  const startSwipe = (target: HTMLElement, x: number, y: number) => {
    if (
      !hasPager ||
      target.closest(
        'a, button, input, textarea, select, summary, [role="button"], [role="tablist"], [role="slider"], [contenteditable="true"]',
      )
    )
      return;
    if (swipeFrame.current !== undefined)
      cancelAnimationFrame(swipeFrame.current);
    gesture.current = { x, y, horizontal: false, prefetchedDirection: 0 };
  };
  const settleSwipe = () => {
    if (swipeFrame.current !== undefined)
      cancelAnimationFrame(swipeFrame.current);
    gesture.current = null;
    setSwipePhase('settling');
    setSwipeOffset(0);
  };
  const moveSwipe = (x: number, y: number) => {
    const start = gesture.current;
    if (!start) return;
    const dx = x - start.x;
    const dy = y - start.y;
    if (!start.horizontal) {
      if (Math.abs(dy) > 8 && Math.abs(dy) >= Math.abs(dx)) {
        settleSwipe();
        return;
      }
      if (Math.abs(dx) < 8 || Math.abs(dx) <= Math.abs(dy) * 1.5) return;
      start.horizontal = true;
    }
    const direction = dx < 0 ? 1 : -1;
    const next = index + direction;
    const hasNext = next >= 0 && next < jobTitles.length;
    if (hasNext && start.prefetchedDirection !== direction) {
      prefetch(jobTitles[next].id);
      start.prefetchedDirection = direction;
    }
    const width = card.current?.clientWidth ?? 320;
    setSwipePhase('dragging');
    // Give the first and last cards resistance instead of suggesting another job.
    setSwipeOffset(
      hasNext ? Math.max(-width * 0.65, Math.min(width * 0.65, dx)) : dx * 0.15,
    );
  };
  const finishSwipe = (x: number, y: number) => {
    const start = gesture.current;
    if (!start) return;
    const dx = x - start.x;
    const dy = y - start.y;
    const direction = dx < 0 ? 1 : -1;
    const next = index + direction;
    const width = card.current?.clientWidth ?? 320;
    const threshold = Math.max(50, Math.min(100, width * 0.2));
    if (
      Math.abs(dx) < threshold ||
      Math.abs(dx) <= Math.abs(dy) * 1.5 ||
      next < 0 ||
      next >= jobTitles.length
    ) {
      settleSwipe();
      return;
    }
    gesture.current = null;
    select(next);
    // Bring the next card in from the side the user is revealing.
    setSwipePhase('entering');
    setSwipeOffset(direction * Math.min(width * 0.3, 120));
    swipeFrame.current = requestAnimationFrame(() => {
      swipeFrame.current = requestAnimationFrame(() => {
        setSwipePhase('settling');
        setSwipeOffset(0);
      });
    });
  };
  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1) return settleSwipe();
    startSwipe(
      event.target as HTMLElement,
      event.touches[0].clientX,
      event.touches[0].clientY,
    );
  };
  const onMousePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button === 0)
      startSwipe(event.target as HTMLElement, event.clientX, event.clientY);
  };
  const footer = (
    <div className='flex min-w-0 flex-wrap items-center border-t border-border/50 px-2 text-xs text-muted-foreground @xl:text-sm @3xl:flex-nowrap @3xl:gap-x-3 @3xl:px-3'>
      {hasPager && (
        <nav
          aria-label={navigationLabel}
          className='flex min-w-0 basis-full items-center @3xl:flex-1 @3xl:basis-0'
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
      <div
        className={cn(
          'flex w-full min-w-0 items-center py-2',
          hasPager &&
            'border-t border-border/50 @3xl:w-auto @3xl:max-w-[45%] @3xl:shrink-0 @3xl:border-t-0',
        )}
      >
        <span
          role='status'
          aria-live='polite'
          aria-atomic='true'
          className='min-w-0 shrink-0 px-2 leading-snug'
        >
          <span className='sr-only'>{selected.title}, </span>
          <span className='block font-medium text-foreground tabular-nums'>
            {hasPager ? `${index + 1} of ${jobTitles.length}` : '1'}{' '}
          </span>
          <span className='block'>
            {importRunId
              ? hasPager
                ? 'new jobs found'
                : 'new job found'
              : hasPager
                ? 'matching jobs'
                : 'matching job'}
          </span>
        </span>
        {organization && (
          <div className='ml-3 min-w-0 flex-1 border-l border-border pl-3 @3xl:ml-2 @3xl:pl-2'>
            <Button
              asChild
              variant='ghost'
              size='sm'
              className='h-auto min-h-9 w-full min-w-0 justify-end gap-2 px-2 py-1 text-right text-xs whitespace-normal @xl:text-sm'
            >
              <LinkWithLoader
                href={organization.href}
                aria-label={allJobsLabel}
              >
                <span className='min-w-0 [overflow-wrap:anywhere]'>
                  View all jobs at {organization.name}
                </span>
                <ArrowRightIcon className='shrink-0' />
              </LinkWithLoader>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
  return (
    <div
      className='@container relative isolate min-w-0 overflow-x-clip'
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
        className='relative min-w-0 motion-reduce:transform-none! motion-reduce:opacity-100! motion-reduce:transition-none!'
        style={{
          transform: swipeOffset
            ? `translateX(${swipeOffset}px) rotate(${Math.max(-3, Math.min(3, swipeOffset / 60))}deg)`
            : undefined,
          transformOrigin: '50% 80%',
          transition:
            swipePhase === 'settling'
              ? 'transform 240ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease-out'
              : 'none',
          opacity: swipePhase === 'entering' ? 0.65 : 1,
        }}
        onTransitionEnd={(event) => {
          if (
            event.target === event.currentTarget &&
            event.propertyName === 'transform'
          )
            setSwipePhase('idle');
        }}
        onTouchStart={onTouchStart}
        onTouchMove={(event) => {
          if (event.touches.length !== 1) return settleSwipe();
          moveSwipe(event.touches[0].clientX, event.touches[0].clientY);
        }}
        onTouchEnd={(event) => {
          if (event.changedTouches.length !== 1) return settleSwipe();
          finishSwipe(
            event.changedTouches[0].clientX,
            event.changedTouches[0].clientY,
          );
        }}
        onTouchCancel={settleSwipe}
        onPointerDown={onMousePointerDown}
        onPointerMove={(event) => {
          if (event.pointerType !== 'mouse' || !gesture.current) return;
          moveSwipe(event.clientX, event.clientY);
          if (gesture.current?.horizontal)
            event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          if (event.pointerType === 'mouse')
            finishSwipe(event.clientX, event.clientY);
        }}
        onPointerCancel={(event) => {
          if (event.pointerType === 'mouse') settleSwipe();
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
