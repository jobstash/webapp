'use client';

import Link from 'next/link';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowDownRightIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BriefcaseBusinessIcon,
  Building2Icon,
  ChartNoAxesCombinedIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { getFrontendSlug } from '@/features/pillar/constants';
import { FlintEChart } from './flint-echart';
import { marketTreemapOption, tickerColor } from './chart-options';
import {
  compactNumber,
  momentumLabel,
  momentumTone,
  monthlySalary,
} from '../lib/format';
import type { JobMarketOverview, JobMarketTicker } from '../schemas';

const TickerLink = ({ ticker }: { ticker: JobMarketTicker }) => {
  const tone = momentumTone(ticker.momentum);
  return (
    <Link
      href={`/${getFrontendSlug(ticker.slug)}`}
      className='group flex min-w-0 items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/55 p-3 transition-colors hover:border-primary/50 hover:bg-background'
    >
      <span className='min-w-0'>
        <span className='block truncate font-semibold'>{ticker.label}</span>
        <span className='block text-xs text-muted-foreground'>
          {compactNumber(ticker.current.activeJobs)} jobs ·{' '}
          {monthlySalary(ticker.current.salary.medianMonthlyUsd)}
        </span>
      </span>
      <span
        className={cn(
          'shrink-0 text-sm font-bold',
          tone === 'positive' && 'text-emerald-400',
          tone === 'negative' && 'text-rose-400',
          tone === 'neutral' && 'text-muted-foreground',
        )}
      >
        {momentumLabel(ticker.momentum)}
      </span>
    </Link>
  );
};

const Movers = ({
  title,
  items,
  direction,
}: {
  title: string;
  items: JobMarketTicker[];
  direction: 'up' | 'down';
}) => {
  const Icon = direction === 'up' ? ArrowUpRightIcon : ArrowDownRightIcon;
  return (
    <div>
      <h3 className='flex items-center gap-2 text-sm font-semibold'>
        <Icon
          className={cn(
            'size-4',
            direction === 'up' ? 'text-emerald-400' : 'text-rose-400',
          )}
          aria-hidden
        />
        {title}
      </h3>
      <div className='mt-3 space-y-2'>
        {items.length > 0 ? (
          items.map((ticker) => (
            <TickerLink key={ticker.slug} ticker={ticker} />
          ))
        ) : (
          <p className='rounded-xl border border-dashed border-border/60 p-4 text-sm text-muted-foreground'>
            No statistically useful outlier this week.
          </p>
        )}
      </div>
    </div>
  );
};

export const MarketOverviewDashboard = ({
  overview,
}: {
  overview: JobMarketOverview;
}) => {
  const router = useRouter();
  const chartOption = useMemo(
    () => marketTreemapOption(overview.classifications),
    [overview.classifications],
  );
  const handleSelect = useCallback(
    (data: Record<string, unknown>) => {
      if (typeof data.slug === 'string') {
        router.push(`/${getFrontendSlug(data.slug)}`);
      }
    },
    [router],
  );

  return (
    <section
      aria-labelledby='market-overview-heading'
      className='mt-6 rounded-2xl border border-border/60 bg-card/60 p-4 shadow-sm md:p-6'
    >
      <div className='flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between'>
        <div>
          <div className='flex items-center gap-2 text-xs font-semibold tracking-widest text-emerald-400 uppercase'>
            <ChartNoAxesCombinedIcon className='size-4' aria-hidden />
            Jobstash market
          </div>
          <h2
            id='market-overview-heading'
            className='mt-2 text-2xl font-bold md:text-3xl'
          >
            Where hiring momentum is moving
          </h2>
          <p className='mt-1 max-w-3xl text-sm text-muted-foreground'>
            Tile size is today’s open-job market. Color measures new listings in
            the last seven days against the previous seven. Select any tile to
            explore that job market.
          </p>
        </div>
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
          <div className='rounded-xl border border-border/60 bg-background/55 px-4 py-3'>
            <BriefcaseBusinessIcon
              className='size-4 text-emerald-400'
              aria-hidden
            />
            <div className='mt-2 text-xl font-bold'>
              {compactNumber(overview.market.current.activeJobs)}
            </div>
            <div className='text-xs text-muted-foreground'>Open jobs</div>
          </div>
          <div className='rounded-xl border border-border/60 bg-background/55 px-4 py-3'>
            <Building2Icon className='size-4 text-blue-400' aria-hidden />
            <div className='mt-2 text-xl font-bold'>
              {compactNumber(overview.market.current.hiringCompanies)}
            </div>
            <div className='text-xs text-muted-foreground'>
              Hiring companies
            </div>
          </div>
          <div className='col-span-2 rounded-xl border border-border/60 bg-background/55 px-4 py-3 sm:col-span-1'>
            <ChartNoAxesCombinedIcon
              className='size-4 text-violet-400'
              aria-hidden
            />
            <div className='mt-2 text-xl font-bold'>
              {momentumLabel(overview.market.momentum)}
            </div>
            <div className='text-xs text-muted-foreground'>Weekly velocity</div>
          </div>
        </div>
      </div>

      <div className='mt-5 grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]'>
        <div className='overflow-hidden rounded-xl border border-border/60 bg-background/45'>
          <FlintEChart
            option={chartOption}
            className='h-[420px] w-full md:h-[520px]'
            ariaLabel='Crypto job market classifications sized by open jobs and colored by weekly hiring momentum'
            onSelect={handleSelect}
          />
          <div className='flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/60 px-4 py-3 text-xs text-muted-foreground'>
            <span className='flex items-center gap-1.5'>
              <span className='size-2.5 rounded-sm bg-emerald-600' /> Growing
            </span>
            <span className='flex items-center gap-1.5'>
              <span className='size-2.5 rounded-sm bg-zinc-600' /> Stable
            </span>
            <span className='flex items-center gap-1.5'>
              <span className='size-2.5 rounded-sm bg-red-600' /> Cooling
            </span>
            <span className='ml-auto'>Updated {overview.asOf}</span>
          </div>
        </div>
        <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-1'>
          <Movers
            title='Bullish opportunities'
            items={overview.movers.bullish}
            direction='up'
          />
          <Movers
            title='Cooling opportunities'
            items={overview.movers.cooling}
            direction='down'
          />
        </div>
      </div>

      <div className='mt-5'>
        <div className='flex items-center justify-between gap-3'>
          <h3 className='text-sm font-semibold'>All job-market tickers</h3>
          <span className='text-xs text-muted-foreground'>7-day change</span>
        </div>
        <div className='mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {overview.classifications.map((ticker) => (
            <Link
              key={ticker.slug}
              href={`/${getFrontendSlug(ticker.slug)}`}
              className='group relative overflow-hidden rounded-xl border border-border/60 p-4 transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
              style={{ backgroundColor: tickerColor(ticker) }}
            >
              <div className='flex items-start justify-between gap-3'>
                <span className='font-bold'>{ticker.label}</span>
                <ArrowRightIcon
                  className='size-4 opacity-60 transition-transform group-hover:translate-x-0.5'
                  aria-hidden
                />
              </div>
              <div className='mt-5 text-2xl font-bold'>
                {compactNumber(ticker.current.activeJobs)}
              </div>
              <div className='mt-1 flex items-center justify-between gap-2 text-xs text-white/80'>
                <span>open jobs</span>
                <strong>{momentumLabel(ticker.momentum)}</strong>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
