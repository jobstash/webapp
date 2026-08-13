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

import { cn } from '@/lib/utils';
import { getFrontendSlug } from '@/features/pillar/constants';
import { compactNumber, momentumLabel, momentumTone } from '../lib/format';
import type { JobMarketOverview, JobMarketTicker } from '../schemas';

const Move = ({ ticker }: { ticker: JobMarketTicker }) => {
  const tone = momentumTone(ticker.momentum);
  const Icon = tone === 'negative' ? ArrowDownRightIcon : ArrowUpRightIcon;
  return (
    <Link
      href={`/${getFrontendSlug(ticker.slug)}`}
      className='group flex min-w-0 items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/55 px-3 py-2.5 transition-colors hover:border-primary/50 hover:bg-background'
    >
      <span className='min-w-0'>
        <span className='block truncate text-sm font-semibold'>
          {ticker.label}
        </span>
        <span className='text-xs text-muted-foreground'>
          {compactNumber(ticker.current.activeJobs)} open roles
        </span>
      </span>
      <span
        className={cn(
          'flex shrink-0 items-center gap-1 text-sm font-bold',
          tone === 'positive' && 'text-emerald-400',
          tone === 'negative' && 'text-rose-400',
        )}
      >
        <Icon className='size-4' aria-hidden />
        {momentumLabel(ticker.momentum)}
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
  return (
    <section
      aria-labelledby='market-overview-heading'
      className='mt-6 rounded-2xl border border-border/60 bg-card/60 p-4 shadow-sm md:p-5'
    >
      <div className='grid gap-4 lg:grid-cols-[minmax(260px,.8fr)_minmax(0,1.8fr)_auto] lg:items-center'>
        <div>
          <div className='flex items-center gap-2 text-xs font-semibold tracking-widest text-emerald-400 uppercase'>
            <ChartNoAxesCombinedIcon className='size-4' aria-hidden />
            Market pulse
          </div>
          <h2 id='market-overview-heading' className='mt-1 text-xl font-bold'>
            Crypto hiring, priced like a market
          </h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            Daily opportunity, compensation, skill repricing, and regional pay.
          </p>
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
            <strong className='mt-1 block text-lg'>
              {momentumLabel(overview.market.momentum)}
            </strong>
            <span className='text-xs text-muted-foreground'>Market trend</span>
          </div>
        </div>

        <Link
          href='/market'
          className='inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-bold text-background transition-opacity hover:opacity-90'
        >
          Open market intelligence
          <ArrowRightIcon className='size-4' aria-hidden />
        </Link>
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
