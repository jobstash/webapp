'use client';

import Link from 'next/link';
import {
  ArrowDownRightIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BriefcaseBusinessIcon,
  Building2Icon,
  ChartNoAxesCombinedIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getFrontendSlug } from '@/features/pillar/constants';
import { compactNumber } from '../lib/format';
import type {
  JobMarketOverview,
  JobMarketPoint,
  JobMarketTicker,
} from '../schemas';

const weeklyVacancyChange = (history: JobMarketPoint[] | undefined) => {
  if (!history || history.length < 2) return null;
  const current = history.at(-1)!;
  const currentTime = Date.parse(current.date);
  const targetTime = currentTime - 7 * 24 * 60 * 60 * 1_000;
  const baseline = [...history]
    .reverse()
    .find((point) => Date.parse(point.date) <= targetTime);
  if (!baseline) return null;
  if (baseline.activeJobs === 0) {
    return current.activeJobs === 0 ? 0 : null;
  }
  return (
    Math.round(
      ((current.activeJobs - baseline.activeJobs) / baseline.activeJobs) *
        1_000,
    ) / 10
  );
};

const changeLabel = (change: number | null) => {
  if (change === null) return 'Not enough history';
  return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
};

const VacancySparkline = ({ ticker }: { ticker: JobMarketTicker }) => {
  const history = ticker.history ?? [];
  if (history.length < 2) return null;
  const historySpanDays =
    Math.round(
      (Date.parse(history.at(-1)!.date) - Date.parse(history[0].date)) /
        (24 * 60 * 60 * 1_000),
    ) + 1;
  const values = history.map((point) => point.activeJobs);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const range = maximum - minimum || 1;
  const width = 160;
  const height = 38;
  const padding = 2;
  const points = values.map((value, index) => {
    const x = padding + (index / (values.length - 1)) * (width - padding * 2);
    const y =
      height - padding - ((value - minimum) / range) * (height - padding * 2);
    return { x, y };
  });
  const line = points.map(({ x, y }) => `${x},${y}`).join(' ');
  const area = `M ${points[0].x} ${height - padding} L ${points
    .map(({ x, y }) => `${x} ${y}`)
    .join(' L ')} L ${points.at(-1)!.x} ${height - padding} Z`;

  return (
    <div className='hidden min-w-28 text-violet-400 sm:block'>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role='img'
        className='h-9 w-full overflow-visible'
      >
        <title>{`${ticker.label} open vacancies over the last ${historySpanDays} days`}</title>
        <path d={area} fill='currentColor' opacity='0.12' />
        <polyline
          points={line}
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <circle
          cx={points.at(-1)!.x}
          cy={points.at(-1)!.y}
          r='2.5'
          fill='currentColor'
        />
      </svg>
      <span className='block text-[10px] text-muted-foreground'>
        Open vacancies · {historySpanDays} days
      </span>
    </div>
  );
};

const Move = ({ ticker }: { ticker: JobMarketTicker }) => {
  const change = weeklyVacancyChange(ticker.history);
  const tone =
    change === null || change === 0
      ? 'neutral'
      : change > 0
        ? 'positive'
        : 'negative';
  const Icon =
    tone === 'negative'
      ? ArrowDownRightIcon
      : tone === 'positive'
        ? ArrowUpRightIcon
        : ArrowRightIcon;
  return (
    <Link
      href={`/${getFrontendSlug(ticker.slug)}`}
      className='group grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-border/60 bg-background/55 px-4 py-3 transition-colors hover:border-primary/50 hover:bg-background sm:grid-cols-[minmax(0,1fr)_minmax(112px,.65fr)_auto]'
    >
      <span className='min-w-0'>
        <span className='block truncate text-sm font-semibold'>
          {ticker.label}
        </span>
        <span className='text-xs text-muted-foreground'>
          {compactNumber(ticker.current.activeJobs)} open vacancies
        </span>
      </span>
      <VacancySparkline ticker={ticker} />
      <span
        className={cn(
          'shrink-0 text-right',
          tone === 'positive' && 'text-emerald-400',
          tone === 'negative' && 'text-rose-400',
          tone === 'neutral' && 'text-muted-foreground',
        )}
      >
        <span className='flex items-center justify-end gap-1 text-sm font-bold'>
          <Icon className='size-4' aria-hidden />
          {changeLabel(change)}
        </span>
        <span className='mt-0.5 block text-[10px] leading-tight text-muted-foreground'>
          Open vacancies
          <br />
          vs 7 days ago
        </span>
      </span>
    </Link>
  );
};

export const MarketOverviewDashboard = ({
  overview,
}: {
  overview: JobMarketOverview;
}) => {
  const moves = [
    ...overview.movers.bullish.slice(0, 3),
    ...overview.movers.cooling.slice(0, 3),
  ];
  const marketWeeklyChange = weeklyVacancyChange(overview.market.history);
  const marketTone =
    marketWeeklyChange === null || marketWeeklyChange === 0
      ? 'neutral'
      : marketWeeklyChange > 0
        ? 'positive'
        : 'negative';
  return (
    <section
      aria-labelledby='market-overview-heading'
      className='mt-6 rounded-2xl border border-border/60 bg-card/60 p-4 shadow-sm md:p-5'
    >
      <div className='grid gap-4 lg:grid-cols-[minmax(260px,.8fr)_minmax(0,1.8fr)_auto] lg:items-center'>
        <div>
          <h2
            id='market-overview-heading'
            className='flex items-center gap-3 text-2xl font-bold tracking-wide text-violet-400 uppercase'
          >
            <ChartNoAxesCombinedIcon className='size-6' aria-hidden />
            Market pulse
          </h2>
        </div>

        <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
          <div className='rounded-xl border border-border/60 bg-background/55 p-3'>
            <BriefcaseBusinessIcon
              className='size-4 text-emerald-400'
              aria-hidden
            />
            <strong className='mt-1 block text-lg'>
              {compactNumber(overview.market.current.activeJobs)}
            </strong>
            <span className='text-xs text-muted-foreground'>Open jobs</span>
          </div>
          <div className='rounded-xl border border-border/60 bg-background/55 p-3'>
            <Building2Icon className='size-4 text-blue-400' aria-hidden />
            <strong className='mt-1 block text-lg'>
              {compactNumber(overview.market.current.hiringCompanies)}
            </strong>
            <span className='text-xs text-muted-foreground'>Employers</span>
          </div>
          <div className='col-span-2 rounded-xl border border-border/60 bg-background/55 p-3 sm:col-span-1'>
            <ChartNoAxesCombinedIcon
              className='size-4 text-violet-400'
              aria-hidden
            />
            <strong
              className={cn(
                'mt-1 block text-lg',
                marketTone === 'positive' && 'text-emerald-400',
                marketTone === 'negative' && 'text-rose-400',
              )}
            >
              {changeLabel(marketWeeklyChange)}
            </strong>
            <span className='text-xs text-muted-foreground'>Weekly change</span>
            <span className='block text-[10px] text-muted-foreground/75'>
              Open vacancies vs 7 days ago
            </span>
          </div>
        </div>

        <Button variant='secondary' size='lg' asChild>
          <Link href='/market'>
            Job Market Analytics
            <ArrowRightIcon aria-hidden />
          </Link>
        </Button>
      </div>

      {moves.length > 0 && (
        <div className='mt-4 grid gap-2 border-t border-border/60 pt-4 sm:grid-cols-2 lg:grid-cols-3'>
          {moves.map((ticker) => (
            <Move key={ticker.slug} ticker={ticker} />
          ))}
        </div>
      )}
    </section>
  );
};
