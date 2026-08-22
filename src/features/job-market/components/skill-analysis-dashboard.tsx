'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  Building2Icon,
  ChartNoAxesCombinedIcon,
  CircleDollarSignIcon,
  MapPinnedIcon,
  SparklesIcon,
} from 'lucide-react';

import type { JobListItemSchema } from '@/features/jobs/schemas';
import { getFrontendSlug } from '@/features/pillar/constants';
import { cn } from '@/lib/utils';
import {
  activityChartOption,
  skillAdjustedValueOption,
  skillSalaryTrendOption,
} from './chart-options';
import { FlintEChart } from './flint-echart';
import {
  actionableLocalCompensation,
  LocalCompensationTable,
} from './local-compensation-table';
import {
  compactNumber,
  monthlySalary,
  momentumLabel,
  percentLabel,
} from '../lib/format';
import type {
  JobMarketCompensation,
  JobMarketPoint,
  JobMarketSkillDetail,
  JobMarketSkillWeeklyPoint,
  PillarMarket,
} from '../schemas';

type Range = '90' | '365' | 'max';
type Segment = 'remote' | 'local';

interface Selection {
  range: Range;
  mode: Segment;
  skill: string;
}

const Metric = ({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof BriefcaseBusinessIcon;
}) => (
  <div className='rounded-xl border border-border/60 bg-background/55 p-4'>
    <div className='flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase'>
      <Icon className='size-4' aria-hidden />
      {label}
    </div>
    <strong className='mt-3 block text-2xl tracking-tight'>{value}</strong>
    <p className='mt-1 text-xs leading-relaxed text-muted-foreground'>
      {detail}
    </p>
  </div>
);

const trimInactiveHistory = (history: JobMarketPoint[]): JobMarketPoint[] => {
  const firstActivity = history.findIndex(
    (point) =>
      point.activeJobs > 0 || point.hiringCompanies > 0 || point.newJobs > 0,
  );
  if (firstActivity <= 0) return history;
  return history.slice(Math.max(0, firstActivity - 14));
};

const readableDate = (value: string): string =>
  new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00.000Z`));

const evidenceDescription = (compensation?: JobMarketCompensation): string => {
  if (!compensation) return 'No salary records yet';
  const breadth =
    compensation.evidenceLevel === 'strong'
      ? 'Broad sample'
      : compensation.evidenceLevel === 'limited'
        ? 'Limited sample'
        : 'Small sample';
  return `${compensation.employerCount} employers · ${breadth}`;
};

const CurrentJobs = ({
  jobs,
  label,
  total,
  href,
}: {
  jobs: JobListItemSchema[];
  label: string;
  total: number;
  href: string;
}) => {
  if (jobs.length === 0) return null;
  return (
    <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Current {label} openings</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            Open jobs available to apply to behind the market counts above.
          </p>
        </div>
        <Link
          href={href}
          className='inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:underline'
        >
          See all {total} jobs <ArrowRightIcon className='size-4' aria-hidden />
        </Link>
      </div>
      <div className='mt-4 grid gap-3 lg:grid-cols-2'>
        {jobs.slice(0, 6).map((job) => (
          <Link
            key={job.id}
            href={job.href}
            className='group rounded-xl border border-border/60 bg-background/55 p-4 transition-colors hover:border-emerald-500/50'
          >
            <strong className='group-hover:text-emerald-400'>
              {job.title}
            </strong>
            <p className='mt-1 text-sm text-muted-foreground'>
              {job.organization?.name ?? 'Organization not listed'}
              {job.location ? ` · ${job.location}` : ''}
            </p>
            <p className='mt-2 text-xs text-muted-foreground'>
              {job.timestampText}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export const SkillAnalysisDashboard = ({
  detail,
  market,
  jobs,
  selection,
}: {
  detail: JobMarketSkillDetail;
  market: PillarMarket;
  jobs: JobListItemSchema[];
  selection: Selection;
}) => {
  const router = useRouter();
  const label = detail.skill.label;
  const jobsHref = `/${getFrontendSlug(detail.skill.slug)}`;
  const paramsFor = (updates: Partial<Pick<Selection, 'range' | 'mode'>>) => {
    const next = { ...selection, ...updates };
    const params = new URLSearchParams();
    if (next.range !== 'max') params.set('range', next.range);
    if (next.mode !== 'remote') params.set('mode', next.mode);
    params.set('skill', next.skill);
    return `/market?${params.toString()}`;
  };

  const benchmark = market.compensation.find(
    (entry) =>
      entry.segment === selection.mode &&
      (entry.regionSlug ===
        (selection.mode === 'remote' ? 'remote' : 'local') ||
        entry.regionType ===
          (selection.mode === 'remote' ? 'remote' : 'aggregate')),
  );
  const remote = market.compensation.find(
    (entry) =>
      entry.segment === 'remote' &&
      (entry.regionSlug === 'remote' || entry.regionType === 'remote'),
  );
  const local = market.compensation.find(
    (entry) =>
      entry.segment === 'local' &&
      (entry.regionSlug === 'local' || entry.regionType === 'aggregate'),
  );
  const signal =
    market.skillSignals.find((entry) => entry.segment === selection.mode) ??
    null;
  const activityHistory = useMemo(
    () => trimInactiveHistory(market.history),
    [market.history],
  );
  const activityOption = useMemo(
    () => activityChartOption(activityHistory),
    [activityHistory],
  );
  const selectedHistory = detail.history.filter(
    (point) => point.segment === selection.mode && point.regionSlug === 'all',
  );
  const hasSalaryHistory = selectedHistory.some(
    (point) => point.medianMonthlyUsd !== null,
  );
  const hasAdjustedHistory = selectedHistory.some(
    (point) => point.adjustedPremiumPercent !== null,
  );
  const fallbackPoint: JobMarketSkillWeeklyPoint = {
    weekStart: detail.asOf,
    segment: selection.mode,
    regionSlug: 'all',
    regionLabel: selection.mode === 'remote' ? 'Remote' : 'All local markets',
    medianMonthlyUsd: hasSalaryHistory
      ? null
      : (benchmark?.medianMonthlyUsd ?? null),
    p25MonthlyUsd: hasSalaryHistory ? null : (benchmark?.p25MonthlyUsd ?? null),
    p75MonthlyUsd: hasSalaryHistory ? null : (benchmark?.p75MonthlyUsd ?? null),
    adjustedPremiumPercent: hasAdjustedHistory
      ? null
      : (benchmark?.adjustedPremiumPercent ?? null),
    sampleCount: benchmark?.sampleCount ?? 0,
    employerCount: benchmark?.employerCount ?? 0,
    onsiteCount: benchmark?.onsiteCount ?? 0,
    hybridCount: benchmark?.hybridCount ?? 0,
    remoteCount: benchmark?.remoteCount ?? 0,
    reliable: benchmark?.reliable ?? false,
  };
  const hasFallback =
    fallbackPoint.medianMonthlyUsd !== null ||
    fallbackPoint.adjustedPremiumPercent !== null;
  const displayedHistory = hasFallback
    ? [...detail.history, fallbackPoint]
    : detail.history;
  const salaryOption = skillSalaryTrendOption(displayedHistory, selection.mode);
  const adjustedOption = skillAdjustedValueOption(
    displayedHistory,
    selection.mode,
  );
  const localMarkets = actionableLocalCompensation(market.compensation);
  const firstActive = activityHistory.find(
    (point) => point.activeJobs > 0 || point.newJobs > 0,
  );
  const peak = activityHistory.reduce<JobMarketPoint | null>(
    (best, point) =>
      !best || point.activeJobs > best.activeJobs ? point : best,
    null,
  );

  return (
    <div className='space-y-6 pb-16'>
      <section className='relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] px-5 py-8 md:px-8 md:py-10'>
        <div className='pointer-events-none absolute -top-24 right-0 size-80 rounded-full bg-emerald-500/10 blur-3xl' />
        <div className='relative'>
          <Link
            href='/market#skill-explorer'
            className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground'
          >
            <ArrowLeftIcon className='size-4' aria-hidden /> Back to skill
            rankings
          </Link>
          <div className='mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
            <div className='max-w-4xl'>
              <div className='flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-emerald-400 uppercase'>
                <SparklesIcon className='size-4' aria-hidden /> Skill market
                analysis
              </div>
              <h1 className='mt-3 text-4xl font-black tracking-tight md:text-6xl'>
                {`${label} jobs, activity & pay`}
              </h1>
              <p className='mt-4 max-w-3xl text-base text-muted-foreground md:text-lg'>
                Every number on this page is limited to jobs tagged {label}.
                Open-job counts only include roles people can apply to now;
                salary evidence also uses historical closed listings.
              </p>
              <p className='mt-3 text-xs text-muted-foreground'>
                Complete through {detail.completeThrough}
              </p>
            </div>
            <Link
              href={jobsHref}
              className='inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-bold text-background'
            >
              Browse {market.current.activeJobs} open {label} jobs
              <ArrowRightIcon className='size-4' aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <h2 className='text-2xl font-bold'>Current opportunity</h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              Live availability and newly observed posting activity for {label},
              not the overall market.
            </p>
          </div>
          <label className='text-xs font-semibold text-muted-foreground'>
            History shown
            <select
              value={selection.range}
              onChange={(event) =>
                router.push(paramsFor({ range: event.target.value as Range }))
              }
              className='mt-1 block min-w-40 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground'
            >
              <option value='max'>Maximum</option>
              <option value='365'>1 year</option>
              <option value='90'>90 days</option>
            </select>
          </label>
        </div>
        <div className='mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
          <Metric
            icon={BriefcaseBusinessIcon}
            label='Open jobs'
            value={compactNumber(market.current.activeJobs)}
            detail={`${market.current.newJobs} first observed on the latest day`}
          />
          <Metric
            icon={Building2Icon}
            label='Hiring companies'
            value={compactNumber(market.current.hiringCompanies)}
            detail='Distinct employers with an applyable role'
          />
          <Metric
            icon={ChartNoAxesCombinedIcon}
            label='7-day new-posting change'
            value={momentumLabel(market.momentum)}
            detail={`${market.momentum.currentJobs} newly observed vs ${market.momentum.previousJobs} in the previous 7 days`}
          />
          <Metric
            icon={MapPinnedIcon}
            label='Tracked since'
            value={
              firstActive ? readableDate(firstActive.date) : 'No activity yet'
            }
            detail={
              peak
                ? `Peak was ${peak.activeJobs} open jobs on ${readableDate(peak.date)}`
                : 'No historical opportunity points yet'
            }
          />
        </div>
        <div className='mt-4 rounded-xl border border-border/60 bg-background/45 p-4'>
          <h3 className='font-semibold'>{label} opportunity over time</h3>
          <p className='text-xs text-muted-foreground'>
            Open jobs, hiring companies, and newly observed roles. Long inactive
            history before the skill first appeared is trimmed from the chart.
          </p>
          <FlintEChart
            option={activityOption}
            className='mt-3 h-80 w-full'
            ariaLabel={`${label} open jobs, hiring companies, and new jobs over time`}
          />
        </div>
      </section>

      <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <h2 className='text-2xl font-bold'>
              {label} compensation evidence
            </h2>
            <p className='mt-1 max-w-3xl text-sm text-muted-foreground'>
              Remote and local roles are kept separate. Closed listings remain
              useful as salary evidence but never increase the open-job count.
            </p>
          </div>
          <div className='flex flex-wrap gap-2' aria-label='Work market'>
            {(['remote', 'local'] as const).map((mode) => {
              const count =
                mode === 'remote' ? remote?.activeJobs : local?.activeJobs;
              return (
                <button
                  key={mode}
                  type='button'
                  onClick={() => router.push(paramsFor({ mode }))}
                  className={cn(
                    'rounded-lg border px-4 py-2 text-sm font-semibold capitalize',
                    selection.mode === mode
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border bg-background text-muted-foreground',
                  )}
                >
                  {mode} · {count ?? 0} open
                </button>
              );
            })}
          </div>
        </div>

        <div className='mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
          <Metric
            icon={BriefcaseBusinessIcon}
            label={`${selection.mode} jobs`}
            value={compactNumber(benchmark?.activeJobs ?? 0)}
            detail={`${benchmark?.hiringCompanies ?? 0} hiring companies`}
          />
          <Metric
            icon={CircleDollarSignIcon}
            label={`${selection.mode} median`}
            value={monthlySalary(benchmark?.medianMonthlyUsd ?? null)}
            detail={`${benchmark?.sampleCount ?? 0} salaries from ${benchmark?.employerCount ?? 0} employers`}
          />
          <Metric
            icon={ChartNoAxesCombinedIcon}
            label='Estimated pay change'
            value={percentLabel(
              signal?.adjustedChangePercent ?? signal?.rawChangePercent ?? null,
            )}
            detail={
              signal
                ? `${signal.recentJobCount} recent ${signal.recentJobCount === 1 ? 'job' : 'jobs'} vs ${signal.baselineJobCount} earlier`
                : 'No comparison window yet'
            }
          />
          <Metric
            icon={Building2Icon}
            label='Salary evidence'
            value={`${benchmark?.sampleCount ?? 0} salaries`}
            detail={evidenceDescription(benchmark)}
          />
        </div>

        <div className='mt-4 grid gap-4 xl:grid-cols-2'>
          <div className='rounded-xl border border-border/60 bg-background/45 p-4'>
            <h3 className='font-semibold'>Observed pay over time</h3>
            <p className='text-xs text-muted-foreground'>
              Weekly USD-converted monthly median and middle 50%. Every
              available sample is shown.
            </p>
            <FlintEChart
              option={salaryOption}
              className='mt-3 h-72 w-full'
              ariaLabel={`${label} ${selection.mode} weekly salary history`}
            />
          </div>

          <div className='rounded-xl border border-border/60 bg-background/45 p-4'>
            <h3 className='font-semibold'>Value beyond job mix</h3>
            <p className='text-xs text-muted-foreground'>
              Weekly premium estimates after controlling for role and seniority.
              Every available sample is shown.
            </p>
            <FlintEChart
              option={adjustedOption}
              className='mt-3 h-72 w-full'
              ariaLabel={`${label} ${selection.mode} adjusted skill premium history`}
            />
            {signal && (
              <div className='mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4'>
                <div className='rounded-lg border border-border/50 p-2.5'>
                  <span className='text-muted-foreground'>Recent median</span>
                  <strong className='mt-1 block text-sm'>
                    {monthlySalary(signal.currentMedianMonthlyUsd)}
                  </strong>
                </div>
                <div className='rounded-lg border border-border/50 p-2.5'>
                  <span className='text-muted-foreground'>Earlier median</span>
                  <strong className='mt-1 block text-sm'>
                    {monthlySalary(signal.baselineMedianMonthlyUsd)}
                  </strong>
                </div>
                <div className='rounded-lg border border-border/50 p-2.5'>
                  <span className='text-muted-foreground'>Observed change</span>
                  <strong className='mt-1 block text-sm'>
                    {percentLabel(signal.rawChangePercent)}
                  </strong>
                </div>
                <div className='rounded-lg border border-border/50 p-2.5'>
                  <span className='text-muted-foreground'>
                    Adjusted estimate
                  </span>
                  <strong className='mt-1 block text-sm'>
                    {percentLabel(signal.adjustedChangePercent)}
                  </strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {localMarkets.length > 0 && (
        <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
          <h2 className='text-2xl font-bold'>Local {label} pay by place</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            Compare onsite and hybrid salaries only where enough listings and
            employers support a useful estimate.
          </p>
          <LocalCompensationTable market={market} />
        </section>
      )}

      <CurrentJobs
        jobs={jobs}
        label={label}
        total={market.current.activeJobs}
        href={jobsHref}
      />

      <section className='rounded-xl border border-border/60 bg-background/45 p-4 text-xs leading-relaxed text-muted-foreground'>
        <strong className='text-foreground'>How to read this analysis.</strong>{' '}
        Opportunity history uses first and last observation dates. Salary
        evidence includes open and closed jobs in the selected history window,
        uses the exchange rate from each observation date, and is shown whenever
        at least one estimate is available. Small samples can move sharply, so
        the salary and employer counts provide important context.
      </section>
    </div>
  );
};
