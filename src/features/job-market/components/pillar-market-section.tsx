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
  const [range, setRange] = useState<Range>(90);
  const history = useMemo(
    () => withinRange(market.history, range),
    [market.history, range],
  );
  const activityOption = useMemo(() => activityChartOption(history), [history]);
  const salaryOption = useMemo(() => salaryChartOption(history), [history]);
  const tone = momentumTone(market.momentum);
  const salary = market.current.salary;
  const hasSalaryHistory = history.some((point) => point.salary.reliable);
  const reconstructed = history.some(
    (point) => point.provenance === 'reconstructed',
  );
  const remoteCompensation = market.compensation.find(
    (entry) => entry.segment === 'remote' && entry.regionSlug === 'remote',
  );
  const localCompensation = market.compensation.find(
    (entry) => entry.segment === 'local' && entry.regionSlug === 'local',
  );
  const localRegions = market.compensation.filter(
    (entry) => entry.segment === 'local' && entry.regionSlug !== 'local',
  );
  const signals = market.skillSignals.filter(
    (signal) => signal.status !== 'insufficient',
  );

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
            Daily demand, hiring breadth, and normalized monthly compensation
            for jobs in this pillar.
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

      <div className='mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5'>
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
        <Metric
          icon={CircleDollarSignIcon}
          label='Salary samples'
          value={compactNumber(salary.sampleCount)}
          detail={
            salary.reliable
              ? `${Math.round(salary.coverage * 100)}% coverage · work modes split below`
              : `Hidden until 10 samples (${salary.sampleCount} available)`
          }
        />
      </div>

      {(market.compensation.length > 0 || signals.length > 0) && (
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

          <div className='mt-4 grid gap-3 sm:grid-cols-2'>
            {[remoteCompensation, localCompensation].map((entry, index) => (
              <div
                key={entry?.regionSlug ?? index}
                className='rounded-lg border border-border/50 bg-background/55 p-4'
              >
                <p className='text-xs font-semibold tracking-wide text-muted-foreground uppercase'>
                  {index === 0 ? 'Remote' : 'Onsite + hybrid'}
                </p>
                <strong className='mt-2 block text-xl'>
                  {monthlySalary(entry?.medianMonthlyUsd ?? null)}
                </strong>
                <p className='mt-1 text-xs text-muted-foreground'>
                  {entry?.reliable
                    ? `${entry.sampleCount} salaries from ${entry.employerCount} employers`
                    : `${entry?.sampleCount ?? 0} salaries; estimate withheld until evidence is broad enough`}
                </p>
                <p className='mt-2 text-xs text-muted-foreground'>
                  {entry?.activeJobs ?? 0} open jobs at{' '}
                  {entry?.hiringCompanies ?? 0} hiring companies
                </p>
              </div>
            ))}
          </div>

          {localRegions.length > 0 && (
            <div className='mt-4 overflow-x-auto'>
              <table className='w-full min-w-[840px] text-left text-sm'>
                <thead className='text-xs text-muted-foreground uppercase'>
                  <tr>
                    <th className='px-3 py-2'>Local region</th>
                    <th className='px-3 py-2'>Open jobs</th>
                    <th className='px-3 py-2'>Hiring companies</th>
                    <th className='px-3 py-2'>Median</th>
                    <th className='px-3 py-2'>Middle 50%</th>
                    <th className='px-3 py-2'>Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {[...localRegions]
                    .sort(
                      (left, right) =>
                        right.activeJobs - left.activeJobs ||
                        left.regionLabel.localeCompare(right.regionLabel),
                    )
                    .map((region) => (
                      <tr
                        key={region.regionSlug}
                        className='border-t border-border/50'
                      >
                        <td className='px-3 py-3 font-medium'>
                          {region.regionLabel}
                        </td>
                        <td className='px-3 py-3'>{region.activeJobs}</td>
                        <td className='px-3 py-3'>{region.hiringCompanies}</td>
                        <td className='px-3 py-3'>
                          {monthlySalary(region.medianMonthlyUsd)}
                        </td>
                        <td className='px-3 py-3 text-muted-foreground'>
                          {region.reliable
                            ? `${monthlySalary(region.p25MonthlyUsd)} – ${monthlySalary(region.p75MonthlyUsd)}`
                            : 'Estimate withheld'}
                        </td>
                        <td className='px-3 py-3 text-muted-foreground'>
                          {region.sampleCount} salaries · {region.employerCount}{' '}
                          employers
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <p className='px-3 pt-3 text-xs leading-relaxed text-muted-foreground'>
                Open jobs are current; salary evidence covers the past 12
                months. City, state, and country matches roll up through the
                canonical place hierarchy and count once per continent.
              </p>
            </div>
          )}
        </div>
      )}

      <div className='mt-5 grid gap-4 xl:grid-cols-2'>
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
        <div className='rounded-xl border border-border/60 bg-background/45 p-4'>
          <div className='flex items-center justify-between gap-3'>
            <div>
              <h3 className='font-semibold'>All-mode pay history</h3>
              <p className='text-xs text-muted-foreground'>
                Historical context; use the work-market split above for current
                pay
              </p>
            </div>
            <CircleDollarSignIcon
              className='size-5 text-amber-400'
              aria-hidden
            />
          </div>
          {hasSalaryHistory ? (
            <FlintEChart
              option={salaryOption}
              className='mt-3 h-72 w-full'
              ariaLabel={`${market.pillar.label} median and percentile monthly salary over ${range} days`}
            />
          ) : (
            <div className='flex h-72 flex-col items-center justify-center px-6 text-center'>
              <CircleDollarSignIcon
                className='mb-3 size-8 text-muted-foreground/50'
                aria-hidden
              />
              <p className='font-medium'>Not enough salary samples yet</p>
              <p className='mt-1 max-w-sm text-sm text-muted-foreground'>
                We publish pay trends once at least ten jobs in this pillar
                contain comparable USD salary data.
              </p>
            </div>
          )}
        </div>
      </div>

      <p className='mt-4 text-xs text-muted-foreground'>
        {reconstructed
          ? 'Earlier dates are reconstructed from each job’s first and last observed dates; new daily samples are exact snapshots.'
          : 'All dates shown are exact daily snapshots.'}
      </p>
    </section>
  );
};
