'use client';

import { useMemo, useState } from 'react';
import {
  BriefcaseBusinessIcon,
  Building2Icon,
  CalendarPlusIcon,
  ChartNoAxesCombinedIcon,
  CircleDollarSignIcon,
  UsersRoundIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { activityChartOption, salaryChartOption } from './chart-options';
import { FlintEChart } from './flint-echart';
import {
  actionableLocalCompensation,
  compensationEvidenceCopy,
  LocalCompensationTable,
} from './local-compensation-table';
import {
  compactNumber,
  momentumLabel,
  momentumTone,
  monthlySalary,
  percentLabel,
} from '../lib/format';
import type { JobMarketPoint, PillarMarket } from '../schemas';

const RANGES = [30, 90, 365] as const;
type Range = (typeof RANGES)[number];

const withinRange = (history: JobMarketPoint[], days: Range) => {
  const latest = history.at(-1);
  if (!latest) return [];
  const floor = new Date(`${latest.date}T00:00:00.000Z`);
  floor.setUTCDate(floor.getUTCDate() - days + 1);
  return history.filter(
    (point) => new Date(`${point.date}T00:00:00.000Z`) >= floor,
  );
};

const Metric = ({
  icon: Icon,
  label,
  value,
  detail,
  tone = 'neutral',
}: {
  icon: typeof BriefcaseBusinessIcon;
  label: string;
  value: string;
  detail?: string;
  tone?: 'positive' | 'negative' | 'neutral';
}) => (
  <div className='rounded-xl border border-border/60 bg-background/55 p-4'>
    <div className='flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase'>
      <Icon className='size-4' aria-hidden />
      {label}
    </div>
    <div
      className={cn(
        'mt-3 text-2xl font-bold tracking-tight',
        tone === 'positive' && 'text-emerald-400',
        tone === 'negative' && 'text-rose-400',
      )}
    >
      {value}
    </div>
    {detail && <p className='mt-1 text-xs text-muted-foreground'>{detail}</p>}
  </div>
);

export const PillarMarketSection = ({ market }: { market: PillarMarket }) => {
  const [range, setRange] = useState<Range>(365);
  const history = useMemo(
    () => withinRange(market.history, range),
    [market.history, range],
  );
  const activityOption = useMemo(() => activityChartOption(history), [history]);
  const salaryOption = useMemo(() => salaryChartOption(history), [history]);
  const tone = momentumTone(market.momentum);
  const hasSalaryHistory = history.some(
    (point) => point.salary.evidenceLevel !== 'insufficient',
  );
  const reconstructed = history.some(
    (point) => point.provenance === 'reconstructed',
  );
  const remoteCompensation = market.compensation.find(
    (entry) => entry.segment === 'remote' && entry.regionSlug === 'remote',
  );
  const localCompensation = market.compensation.find(
    (entry) => entry.segment === 'local' && entry.regionSlug === 'local',
  );
  const workMarkets = [remoteCompensation, localCompensation].filter(
    (entry): entry is NonNullable<typeof entry> =>
      Boolean(entry && entry.evidenceLevel !== 'insufficient'),
  );
  const organizationPillar = market.pillar.kind === 'organizations';
  const signals = market.skillSignals.filter(
    (signal) => signal.status !== 'insufficient',
  );
  const hasCompensation =
    workMarkets.length > 0 ||
    actionableLocalCompensation(market.compensation).length > 0;

  return (
    <section
      aria-labelledby='pillar-market-heading'
      className='mx-auto mt-6 w-full rounded-2xl border border-border/60 bg-card/60 p-4 shadow-sm md:p-6'
    >
      <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <div>
          <div className='flex items-center gap-2 text-xs font-semibold tracking-widest text-emerald-400 uppercase'>
            <ChartNoAxesCombinedIcon className='size-4' aria-hidden />
            Job market intelligence
          </div>
          <h2 id='pillar-market-heading' className='mt-2 text-2xl font-bold'>
            {market.pillar.label} market pulse
          </h2>
          <p className='mt-1 max-w-3xl text-sm text-muted-foreground'>
            Daily open opportunities, newly observed postings, hiring breadth,
            and normalized monthly compensation for jobs in this pillar.
          </p>
        </div>
        <div
          className='inline-flex self-start rounded-lg border border-border/60 bg-background/60 p-1'
          aria-label='Chart time range'
        >
          {RANGES.map((days) => (
            <button
              key={days}
              type='button'
              aria-pressed={range === days}
              onClick={() => setRange(days)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
                range === days
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {days === 365 ? '1Y' : `${days}D`}
            </button>
          ))}
        </div>
      </div>

      <div className='mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
        <Metric
          icon={BriefcaseBusinessIcon}
          label='Open jobs'
          value={compactNumber(market.current.activeJobs)}
          detail={`As of ${market.asOf}`}
        />
        <Metric
          icon={Building2Icon}
          label='Hiring companies'
          value={compactNumber(market.current.hiringCompanies)}
          detail='Distinct employers'
        />
        <Metric
          icon={CalendarPlusIcon}
          label='New this week'
          value={compactNumber(market.momentum.currentJobs)}
          detail={`${market.momentum.absoluteChange >= 0 ? '+' : ''}${market.momentum.absoluteChange} vs prior week`}
        />
        <Metric
          icon={ChartNoAxesCombinedIcon}
          label='Job velocity'
          value={momentumLabel(market.momentum)}
          detail='7 days vs previous 7 days'
          tone={tone}
        />
      </div>

      {(hasCompensation || signals.length > 0) && (
        <div className='mt-5 rounded-xl border border-border/60 bg-background/45 p-4'>
          <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <h3 className='font-semibold'>Compensation by work market</h3>
              <p className='text-xs text-muted-foreground'>
                Remote pay is separated from onsite and hybrid pay so expensive
                cities do not distort the remote benchmark.
              </p>
            </div>
            {signals.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {signals.map((signal) => (
                  <span
                    key={signal.segment}
                    className={cn(
                      'rounded-full px-2.5 py-1 text-xs font-semibold',
                      signal.status === 'rising' &&
                        'bg-emerald-500/15 text-emerald-400',
                      signal.status === 'falling' &&
                        'bg-rose-500/15 text-rose-400',
                      signal.status === 'stable' &&
                        'bg-zinc-700/50 text-zinc-300',
                    )}
                  >
                    {signal.segment}: {signal.status}{' '}
                    {signal.status === 'stable'
                      ? ''
                      : percentLabel(signal.adjustedChangePercent)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {workMarkets.length > 0 && (
            <div
              className={cn(
                'mt-4 grid gap-3',
                workMarkets.length > 1 && 'sm:grid-cols-2',
              )}
            >
              {workMarkets.map((entry) => (
                <div
                  key={entry.regionSlug}
                  className='rounded-lg border border-border/50 bg-background/55 p-4'
                >
                  <div className='flex items-center justify-between gap-3'>
                    <p className='text-xs font-semibold tracking-wide text-muted-foreground uppercase'>
                      {entry.segment === 'remote'
                        ? 'Remote'
                        : 'Onsite + hybrid'}
                    </p>
                    {entry.evidenceLevel === 'limited' && (
                      <span className='rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-300'>
                        Limited evidence
                      </span>
                    )}
                  </div>
                  <strong className='mt-2 block text-xl'>
                    {monthlySalary(entry.medianMonthlyUsd)}
                  </strong>
                  <p className='mt-1 text-xs text-muted-foreground'>
                    {compensationEvidenceCopy(entry, organizationPillar)}
                  </p>
                  <p className='mt-2 text-xs text-muted-foreground'>
                    {entry.activeJobs} open jobs at {entry.hiringCompanies}{' '}
                    hiring companies
                  </p>
                </div>
              ))}
            </div>
          )}

          <LocalCompensationTable market={market} />
        </div>
      )}

      <div
        className={cn('mt-5 grid gap-4', hasSalaryHistory && 'xl:grid-cols-2')}
      >
        <div className='rounded-xl border border-border/60 bg-background/45 p-4'>
          <div className='flex items-center justify-between gap-3'>
            <div>
              <h3 className='font-semibold'>Opportunity activity</h3>
              <p className='text-xs text-muted-foreground'>
                Open roles, employers, and newly listed jobs by day
              </p>
            </div>
            <UsersRoundIcon className='size-5 text-blue-400' aria-hidden />
          </div>
          <FlintEChart
            option={activityOption}
            className='mt-3 h-72 w-full'
            ariaLabel={`${market.pillar.label} daily open jobs, hiring companies, and new jobs over ${range} days`}
          />
        </div>
        {hasSalaryHistory && (
          <div className='rounded-xl border border-border/60 bg-background/45 p-4'>
            <div className='flex items-center justify-between gap-3'>
              <div>
                <h3 className='font-semibold'>All-mode pay history</h3>
                <p className='text-xs text-muted-foreground'>
                  Historical context; use the work-market split above for
                  current pay
                </p>
              </div>
              <CircleDollarSignIcon
                className='size-5 text-amber-400'
                aria-hidden
              />
            </div>
            <FlintEChart
              option={salaryOption}
              className='mt-3 h-72 w-full'
              ariaLabel={`${market.pillar.label} median and percentile monthly salary over ${range} days`}
            />
          </div>
        )}
      </div>

      <p className='mt-4 text-xs text-muted-foreground'>
        {reconstructed
          ? 'Earlier open counts are estimated from observation dates. Offline postings are never inferred open for more than 90 days; new daily samples are exact snapshots.'
          : 'All dates shown are exact daily snapshots.'}
      </p>
    </section>
  );
};
