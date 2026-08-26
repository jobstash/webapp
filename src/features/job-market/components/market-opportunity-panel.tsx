'use client';

import { useMemo, useState } from 'react';
import type { EChartsCoreOption } from 'echarts/core';
import {
  ArrowDownRightIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BriefcaseBusinessIcon,
  ChartNoAxesCombinedIcon,
  CrosshairIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import type { JobMarketState, JobMarketTicker } from '../schemas';
import {
  compactNumber,
  percentagePointLabel,
  percentLabel,
} from '../lib/format';
import { FlintEChart } from './flint-echart';

const relativeMove = (ticker: JobMarketTicker) =>
  ticker.activity.marketComparison.openInventoryPercentagePoints;

const moveTone = (value: number | null) => {
  if (value === null || Math.abs(value) < 5) return 'neutral';
  return value > 0 ? 'positive' : 'negative';
};

const MoveIcon = ({ value }: { value: number | null }) => {
  const tone = moveTone(value);
  const Icon =
    tone === 'positive'
      ? ArrowUpRightIcon
      : tone === 'negative'
        ? ArrowDownRightIcon
        : ArrowRightIcon;
  return <Icon className='size-4' aria-hidden />;
};

const MoverRow = ({
  ticker,
  onSelect,
}: {
  ticker: JobMarketTicker;
  onSelect: (slug: string) => void;
}) => {
  const value = relativeMove(ticker);
  const tone = moveTone(value);
  const marketAnalysisLabel = `Open ${ticker.label} market analysis`;

  return (
    <button
      type='button'
      onClick={() => onSelect(ticker.slug)}
      className='group grid min-h-14 w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-border/50 px-4 py-3 text-left transition-colors first:border-t-0 hover:bg-background/70 focus-visible:bg-background/70 focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:outline-none focus-visible:ring-inset'
      aria-label={marketAnalysisLabel}
    >
      <span className='min-w-0'>
        <strong className='block truncate text-sm'>{ticker.label}</strong>
        <span className='mt-0.5 block truncate text-xs text-muted-foreground'>
          {compactNumber(ticker.current.activeJobs)} open ·{' '}
          {compactNumber(ticker.current.hiringCompanies)} companies
        </span>
      </span>
      <span
        className={cn(
          'min-w-24 text-right tabular-nums',
          tone === 'positive' && 'text-emerald-400',
          tone === 'negative' && 'text-rose-400',
          tone === 'neutral' && 'text-muted-foreground',
        )}
      >
        <span className='flex items-center justify-end gap-1 text-sm font-bold'>
          <MoveIcon value={value} />
          {percentagePointLabel(value)}
        </span>
        <span className='block text-[10px] font-medium text-muted-foreground'>
          vs overall market
        </span>
      </span>
    </button>
  );
};

const MoversGroup = ({
  title,
  tone,
  movers,
  onSelect,
}: {
  title: string;
  tone: 'positive' | 'negative';
  movers: JobMarketTicker[];
  onSelect: (slug: string) => void;
}) => (
  <div className='overflow-hidden rounded-xl border border-border/60 bg-background/40'>
    <div className='flex items-center justify-between px-4 py-3'>
      <span
        className={cn(
          'text-[11px] font-bold tracking-[0.16em] uppercase',
          tone === 'positive' ? 'text-emerald-400' : 'text-rose-400',
        )}
      >
        {title}
      </span>
      <span className='text-[10px] text-muted-foreground'>7-day signal</span>
    </div>
    <div className='border-t border-border/50'>
      {movers.length > 0 ? (
        movers.map((ticker) => (
          <MoverRow key={ticker.slug} ticker={ticker} onSelect={onSelect} />
        ))
      ) : (
        <p className='px-4 py-5 text-sm text-muted-foreground'>
          No significant moves in this direction.
        </p>
      )}
    </div>
  </div>
);

const MarketSummary = ({
  label,
  value,
  detail,
  icon: Icon,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof BriefcaseBusinessIcon;
  tone?: 'positive' | 'negative' | 'neutral';
}) => (
  <div className='min-w-0 border-t border-border/50 p-4 first:border-t-0 sm:border-t-0 sm:border-l sm:first:border-l-0 md:px-5'>
    <div className='flex items-center gap-2 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase'>
      <Icon className='size-3.5' aria-hidden />
      {label}
    </div>
    <strong
      className={cn(
        'mt-2 block truncate text-lg font-bold tracking-tight tabular-nums',
        tone === 'positive' && 'text-emerald-400',
        tone === 'negative' && 'text-rose-400',
      )}
    >
      {value}
    </strong>
    <span className='mt-0.5 block truncate text-xs text-muted-foreground'>
      {detail}
    </span>
  </div>
);

const MobileMarketTable = ({
  tickers,
  onSelect,
}: {
  tickers: JobMarketTicker[];
  onSelect: (slug: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? tickers : tickers.slice(0, 8);

  return (
    <div className='md:hidden'>
      <div className='grid grid-cols-[minmax(0,1fr)_auto_auto] gap-3 border-y border-border/60 px-3 py-2 text-[10px] font-bold tracking-[0.12em] text-muted-foreground uppercase'>
        <span>Role</span>
        <span className='text-right'>Open</span>
        <span className='min-w-20 text-right'>Vs market</span>
      </div>
      <div>
        {visible.map((ticker) => {
          const value = relativeMove(ticker);
          const tone = moveTone(value);
          const marketAnalysisLabel = `Open ${ticker.label} market analysis`;
          return (
            <button
              key={ticker.slug}
              type='button'
              onClick={() => onSelect(ticker.slug)}
              className='grid min-h-12 w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 border-b border-border/50 px-3 py-2 text-left hover:bg-background/70 focus-visible:bg-background/70 focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:outline-none focus-visible:ring-inset'
              aria-label={marketAnalysisLabel}
            >
              <span className='truncate text-sm font-semibold'>
                {ticker.label}
              </span>
              <span className='text-right text-xs font-medium tabular-nums'>
                {compactNumber(ticker.current.activeJobs)}
              </span>
              <span
                className={cn(
                  'min-w-20 text-right text-xs font-bold tabular-nums',
                  tone === 'positive' && 'text-emerald-400',
                  tone === 'negative' && 'text-rose-400',
                  tone === 'neutral' && 'text-muted-foreground',
                )}
              >
                {percentagePointLabel(value)}
              </span>
            </button>
          );
        })}
      </div>
      {tickers.length > 8 && (
        <button
          type='button'
          onClick={() => setExpanded((value) => !value)}
          className='mt-3 w-full rounded-lg border border-border/60 bg-background/45 px-4 py-2.5 text-sm font-semibold hover:border-primary/50 hover:bg-background'
        >
          {expanded
            ? 'Show fewer categories'
            : `Show all ${tickers.length} categories`}
        </button>
      )}
    </div>
  );
};

export const MarketOpportunityPanel = ({
  state,
  treemap,
  onSelect,
}: {
  state: JobMarketState;
  treemap: EChartsCoreOption;
  onSelect: (slug: string) => void;
}) => {
  const categories = useMemo(
    () =>
      [...state.classifications]
        .filter((ticker) => ticker.current.activeJobs > 0)
        .sort(
          (left, right) => right.current.activeJobs - left.current.activeJobs,
        ),
    [state.classifications],
  );
  const movers = useMemo(() => {
    const unique = new Map<string, JobMarketTicker>();
    for (const ticker of [...state.movers.bullish, ...state.movers.cooling]) {
      unique.set(ticker.slug, ticker);
    }
    return [...unique.values()].filter(
      (ticker) => relativeMove(ticker) !== null,
    );
  }, [state.movers]);
  const outperforming = movers
    .filter((ticker) => (relativeMove(ticker) ?? 0) > 0)
    .sort(
      (left, right) => (relativeMove(right) ?? 0) - (relativeMove(left) ?? 0),
    )
    .slice(0, 4);
  const underperforming = movers
    .filter((ticker) => (relativeMove(ticker) ?? 0) < 0)
    .sort(
      (left, right) => (relativeMove(left) ?? 0) - (relativeMove(right) ?? 0),
    )
    .slice(0, 4);
  const widestMove = [...movers].sort(
    (left, right) =>
      Math.abs(relativeMove(right) ?? 0) - Math.abs(relativeMove(left) ?? 0),
  )[0];
  const widestMoveValue = widestMove ? relativeMove(widestMove) : null;
  const widestMoveTone = moveTone(widestMoveValue);

  return (
    <section
      aria-labelledby='opportunity-map-heading'
      className='overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-sm'
    >
      <div className='relative overflow-hidden px-4 py-5 md:px-6 md:py-6'>
        <div className='pointer-events-none absolute -top-24 right-12 size-64 rounded-full bg-violet-500/8 blur-3xl' />
        <div className='relative flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between'>
          <div className='max-w-3xl'>
            <div className='flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-violet-400 uppercase'>
              <ChartNoAxesCombinedIcon className='size-4' aria-hidden />
              Market breadth · 7D
            </div>
            <h2
              id='opportunity-map-heading'
              className='mt-2 text-2xl font-bold tracking-tight md:text-3xl'
            >
              Opportunity map
            </h2>
            <p className='mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground'>
              Tile size shows open jobs. Color shows 7-day open-inventory change
              relative to the overall market.
            </p>
          </div>
          <div className='min-w-64 rounded-xl border border-border/60 bg-background/45 p-3'>
            <div className='flex items-center justify-between text-[10px] font-bold tracking-[0.12em] text-muted-foreground uppercase'>
              <span>Cooling</span>
              <span>In line</span>
              <span>Outperforming</span>
            </div>
            <div className='mt-2 h-1.5 rounded-full bg-gradient-to-r from-rose-500 via-zinc-600 to-emerald-500' />
            <div className='mt-2 flex items-center justify-between text-[10px] text-muted-foreground'>
              <span>≤ −5 pp</span>
              <span>−5 to +5 pp</span>
              <span>≥ +5 pp</span>
            </div>
          </div>
        </div>
      </div>

      <div className='grid border-t border-border/60 sm:grid-cols-3'>
        <MarketSummary
          icon={ChartNoAxesCombinedIcon}
          label='Market baseline'
          value={percentLabel(
            state.market.activity.openInventory.percentChange,
          )}
          detail='7-day open-job change'
          tone={moveTone(state.market.activity.openInventory.percentChange)}
        />
        <MarketSummary
          icon={BriefcaseBusinessIcon}
          label='Largest category'
          value={categories[0]?.label ?? 'No current data'}
          detail={`${compactNumber(categories[0]?.current.activeJobs ?? 0)} open jobs`}
        />
        <MarketSummary
          icon={CrosshairIcon}
          label='Widest divergence'
          value={percentagePointLabel(widestMoveValue)}
          detail={widestMove?.label ?? 'No significant move'}
          tone={widestMoveTone}
        />
      </div>

      <div className='grid border-t border-border/60 xl:grid-cols-[minmax(0,1.9fr)_minmax(330px,.75fr)]'>
        <div className='min-w-0 p-4 md:p-6'>
          <div className='mb-4 flex items-end justify-between gap-4'>
            <div>
              <h3 className='text-base font-bold'>Job category map</h3>
              <p className='mt-1 text-xs text-muted-foreground'>
                Select a category to open its full market analysis.
              </p>
            </div>
            <span className='hidden text-[10px] font-medium tracking-wide text-muted-foreground uppercase md:block'>
              Through {state.completeThrough}
            </span>
          </div>
          <div className='hidden overflow-hidden rounded-xl border border-border/60 bg-background/30 p-2 md:block'>
            <FlintEChart
              option={treemap}
              className='h-[34rem] w-full'
              ariaLabel='Crypto job categories sized by open jobs and colored by 7-day open-inventory change relative to the overall market'
              onSelect={(entry) => {
                if (typeof entry.slug === 'string') onSelect(entry.slug);
              }}
            />
          </div>
          <MobileMarketTable tickers={categories} onSelect={onSelect} />
        </div>

        <aside className='border-t border-border/60 bg-background/20 p-4 md:p-6 xl:border-t-0 xl:border-l'>
          <div className='mb-4'>
            <h3 className='text-base font-bold'>Market movers</h3>
            <p className='mt-1 text-xs leading-relaxed text-muted-foreground'>
              Categories diverging most from the overall market—not just
              changing in absolute terms.
            </p>
          </div>
          <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-1'>
            <MoversGroup
              title='Outperforming market'
              tone='positive'
              movers={outperforming}
              onSelect={onSelect}
            />
            <MoversGroup
              title='Underperforming market'
              tone='negative'
              movers={underperforming}
              onSelect={onSelect}
            />
          </div>
        </aside>
      </div>
    </section>
  );
};
