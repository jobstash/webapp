'use client';

import Link from 'next/link';
import { useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowDownRightIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BriefcaseBusinessIcon,
  Building2Icon,
  ChartNoAxesCombinedIcon,
  CircleDollarSignIcon,
  Globe2Icon,
  SearchIcon,
  SparklesIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { getFrontendSlug } from '@/features/pillar/constants';
import {
  marketTreemapOption,
  skillAdjustedValueOption,
  skillSalaryTrendOption,
} from './chart-options';
import { FlintEChart } from './flint-echart';
import { MarketGeographyMap } from './market-geography-map';
import {
  compactNumber,
  monthlySalary,
  percentLabel,
  relativeMomentumLabel,
} from '../lib/format';
import type {
  JobMarketCompensation,
  JobMarketSkillDetail,
  JobMarketSkillList,
  JobMarketSkillSignal,
  JobMarketState,
  JobMarketTicker,
} from '../schemas';

type Range = '90' | '365' | 'max';
type Segment = 'remote' | 'local';
type SkillSort = JobMarketSkillList['sort'];

interface Selection {
  range: Range;
  classification: string;
  mode: Segment;
  sort: SkillSort;
  query: string;
  skill: string | null;
}

const TRENDS: Array<{ value: SkillSort; label: string }> = [
  { value: 'breakout', label: 'Breakouts' },
  { value: 'repricing', label: 'Pay rising' },
  { value: 'salary', label: 'Highest pay' },
  { value: 'demand', label: 'Demand rising' },
  { value: 'cooling', label: 'Demand cooling' },
];

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
    <p className='mt-1 text-xs text-muted-foreground'>{detail}</p>
  </div>
);

const CompensationCard = ({
  title,
  compensation,
}: {
  title: string;
  compensation?: JobMarketCompensation;
}) => (
  <div className='rounded-xl border border-border/60 bg-background/50 p-4'>
    <p className='text-xs font-semibold tracking-wide text-muted-foreground uppercase'>
      {title}
    </p>
    <strong className='mt-2 block text-2xl'>
      {monthlySalary(compensation?.medianMonthlyUsd ?? null)}
    </strong>
    <p className='mt-1 text-xs text-muted-foreground'>
      {compensation?.reliable
        ? `${monthlySalary(compensation.p25MonthlyUsd)} – ${monthlySalary(compensation.p75MonthlyUsd)} middle 50%`
        : `${compensation?.sampleCount ?? 0} salaries · ${compensation?.employerCount ?? 0} employers; estimate withheld`}
    </p>
    {compensation?.segment === 'local' && (
      <p className='mt-2 text-xs text-muted-foreground'>
        {compensation.onsiteCount} onsite · {compensation.hybridCount} hybrid
      </p>
    )}
  </div>
);

const SignalBadge = ({ signal }: { signal: JobMarketSkillSignal | null }) => {
  if (!signal || signal.status === 'insufficient') {
    return (
      <span className='rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-400'>
        Building evidence
      </span>
    );
  }
  const positive = signal.status === 'rising';
  const negative = signal.status === 'falling';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold',
        positive && 'bg-emerald-500/15 text-emerald-400',
        negative && 'bg-rose-500/15 text-rose-400',
        signal.status === 'stable' && 'bg-zinc-800 text-zinc-300',
      )}
    >
      {positive ? (
        <ArrowUpRightIcon className='size-3' aria-hidden />
      ) : negative ? (
        <ArrowDownRightIcon className='size-3' aria-hidden />
      ) : null}
      {signal.status === 'stable'
        ? 'Statistically stable'
        : `${percentLabel(signal.adjustedChangePercent)} adjusted`}
    </span>
  );
};

const ClassificationMove = ({ ticker }: { ticker: JobMarketTicker }) => (
  <Link
    href={`/${getFrontendSlug(ticker.slug)}`}
    className='flex items-center justify-between gap-3 border-t border-border/50 py-3 first:border-0'
  >
    <span>
      <strong className='block text-sm'>{ticker.label}</strong>
      <span className='text-xs text-muted-foreground'>
        {compactNumber(ticker.current.activeJobs)} open jobs
      </span>
    </span>
    <span
      className={cn(
        'text-sm font-bold',
        ticker.momentum.direction === 'up' && 'text-emerald-400',
        ticker.momentum.direction === 'down' && 'text-rose-400',
      )}
    >
      {relativeMomentumLabel(ticker.momentum)}
    </span>
  </Link>
);

const SkillDetail = ({
  detail,
  mode,
}: {
  detail: JobMarketSkillDetail;
  mode: Segment;
}) => {
  const salaryOption = useMemo(
    () => skillSalaryTrendOption(detail.history, mode),
    [detail.history, mode],
  );
  const valueOption = useMemo(
    () => skillAdjustedValueOption(detail.history, mode),
    [detail.history, mode],
  );
  const signal = detail.signals.find((entry) => entry.segment === mode) ?? null;
  const benchmark = detail.compensation.find(
    (entry) =>
      entry.segment === mode &&
      entry.regionSlug === (mode === 'remote' ? 'remote' : 'local'),
  );
  const regions = detail.compensation.filter(
    (entry) => entry.segment === 'local' && entry.regionSlug !== 'local',
  );

  return (
    <section
      id='selected-skill'
      aria-labelledby='selected-skill-heading'
      className='rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] p-4 md:p-6'
    >
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <div className='flex items-center gap-2'>
            <SparklesIcon className='size-4 text-emerald-400' aria-hidden />
            <span className='text-xs font-semibold tracking-widest text-emerald-400 uppercase'>
              Skill alpha
            </span>
          </div>
          <h2 id='selected-skill-heading' className='mt-2 text-3xl font-bold'>
            {detail.skill.label}
          </h2>
          <p className='mt-1 max-w-2xl text-sm text-muted-foreground'>
            Pay change after accounting for role, seniority, work mode, and
            local continent. Signals compare the latest 28 days with the prior
            84 days and require repeated, employer-diverse evidence.
          </p>
        </div>
        <Link
          href={`/${getFrontendSlug(detail.skill.slug)}`}
          className='inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-bold text-background'
        >
          Browse jobs using {detail.skill.label}
          <ArrowRightIcon className='size-4' aria-hidden />
        </Link>
      </div>

      <div className='mt-5 grid gap-3 sm:grid-cols-3'>
        <Metric
          icon={CircleDollarSignIcon}
          label={`${mode} median`}
          value={monthlySalary(benchmark?.medianMonthlyUsd ?? null)}
          detail={`${benchmark?.sampleCount ?? 0} salaries from ${benchmark?.employerCount ?? 0} employers`}
        />
        <Metric
          icon={ChartNoAxesCombinedIcon}
          label='Adjusted value change'
          value={percentLabel(signal?.adjustedChangePercent ?? null)}
          detail={
            !signal ||
            signal.confidenceLowPercent === null ||
            signal?.confidenceHighPercent === null
              ? 'No publishable confidence interval yet'
              : `95% range ${percentLabel(signal.confidenceLowPercent)} to ${percentLabel(signal.confidenceHighPercent)}`
          }
        />
        <div className='rounded-xl border border-border/60 bg-background/55 p-4'>
          <p className='text-xs font-semibold tracking-wide text-muted-foreground uppercase'>
            Evidence status
          </p>
          <div className='mt-3'>
            <SignalBadge signal={signal} />
          </div>
          <p className='mt-2 text-xs text-muted-foreground'>
            {signal
              ? `${signal.recentJobCount} recent jobs · ${signal.recentEmployerCount} recent employers`
              : 'This skill has not met the publication threshold.'}
          </p>
        </div>
      </div>

      <div className='mt-4 grid gap-4 xl:grid-cols-2'>
        <div className='rounded-xl border border-border/60 bg-background/45 p-4'>
          <h3 className='font-semibold'>Observed pay over time</h3>
          <p className='text-xs text-muted-foreground'>
            Weekly USD-converted monthly median and middle 50%
          </p>
          <FlintEChart
            option={salaryOption}
            className='mt-3 h-72 w-full'
            ariaLabel={`${detail.skill.label} ${mode} weekly salary history`}
          />
        </div>
        <div className='rounded-xl border border-border/60 bg-background/45 p-4'>
          <h3 className='font-semibold'>Value beyond job mix</h3>
          <p className='text-xs text-muted-foreground'>
            Premium after controlling for role and seniority cohorts
          </p>
          <FlintEChart
            option={valueOption}
            className='mt-3 h-72 w-full'
            ariaLabel={`${detail.skill.label} ${mode} adjusted skill premium history`}
          />
        </div>
      </div>

      {regions.length > 0 && (
        <div className='mt-4 overflow-x-auto rounded-xl border border-border/60 bg-background/45'>
          <table className='w-full min-w-[680px] text-left text-sm'>
            <thead className='text-xs text-muted-foreground uppercase'>
              <tr>
                <th className='px-4 py-3'>Local market</th>
                <th className='px-4 py-3'>Monthly median</th>
                <th className='px-4 py-3'>Middle 50%</th>
                <th className='px-4 py-3'>Evidence</th>
                <th className='px-4 py-3'>Mix</th>
              </tr>
            </thead>
            <tbody>
              {regions.map((region) => (
                <tr
                  key={region.regionSlug}
                  className='border-t border-border/50'
                >
                  <td className='px-4 py-3 font-medium'>
                    {region.regionLabel}
                  </td>
                  <td className='px-4 py-3'>
                    {monthlySalary(region.medianMonthlyUsd)}
                  </td>
                  <td className='px-4 py-3 text-muted-foreground'>
                    {region.reliable
                      ? `${monthlySalary(region.p25MonthlyUsd)} – ${monthlySalary(region.p75MonthlyUsd)}`
                      : 'Estimate withheld'}
                  </td>
                  <td className='px-4 py-3'>
                    {region.sampleCount} salaries · {region.employerCount}{' '}
                    employers
                  </td>
                  <td className='px-4 py-3 text-muted-foreground'>
                    {region.onsiteCount} onsite · {region.hybridCount} hybrid
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export const MarketStateDashboard = ({
  state,
  skills,
  detail,
  selection,
}: {
  state: JobMarketState;
  skills: JobMarketSkillList;
  detail: JobMarketSkillDetail | null;
  selection: Selection;
}) => {
  const router = useRouter();
  const [query, setQuery] = useState(selection.query);
  const treemap = useMemo(
    () => marketTreemapOption(state.classifications),
    [state.classifications],
  );
  const paramsFor = (updates: Partial<Selection>) => {
    const next = { ...selection, ...updates };
    const params = new URLSearchParams();
    if (next.range !== 'max') params.set('range', next.range);
    if (next.classification !== 'market') {
      params.set('classification', next.classification);
    }
    if (next.mode !== 'remote') params.set('mode', next.mode);
    if (next.sort !== 'breakout') params.set('sort', next.sort);
    if (next.query) params.set('q', next.query);
    if (next.skill) params.set('skill', next.skill);
    const suffix = params.toString();
    return `/market${suffix ? `?${suffix}` : ''}`;
  };
  const navigate = (updates: Partial<Selection>) => {
    router.push(paramsFor(updates));
  };
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate({ query: query.trim(), skill: null });
  };
  const remote = state.geography.find(
    (entry) => entry.segment === 'remote' && entry.regionSlug === 'remote',
  );
  const local = state.geography.find(
    (entry) => entry.segment === 'local' && entry.regionSlug === 'local',
  );
  const scopeTicker =
    selection.classification === 'market'
      ? state.market
      : (state.classifications.find(
          (ticker) => ticker.slug === selection.classification,
        ) ?? state.market);

  return (
    <div className='space-y-6 pb-16'>
      <section className='relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 px-5 py-8 md:px-8 md:py-10'>
        <div className='pointer-events-none absolute -top-24 right-0 size-80 rounded-full bg-emerald-500/10 blur-3xl' />
        <div className='relative max-w-4xl'>
          <div className='flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-emerald-400 uppercase'>
            <ChartNoAxesCombinedIcon className='size-4' aria-hidden />
            State of the crypto job market
          </div>
          <h1 className='mt-3 text-4xl font-black tracking-tight md:text-6xl'>
            Hiring intelligence you can act on
          </h1>
          <p className='mt-4 max-w-3xl text-base text-muted-foreground md:text-lg'>
            See which roles are heating up, where local jobs pay best, and which
            skills are gaining value after accounting for job mix—not just raw
            salary averages.
          </p>
          <p className='mt-4 text-xs text-muted-foreground'>
            Complete through {state.completeThrough} · Daily demand · Weekly
            compensation · Historical exchange rates
          </p>
        </div>
      </section>

      <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
        <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
          <div>
            <h2 className='text-2xl font-bold'>Market scope</h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              Pick one role family and a history window. Every region uses the
              same salary color scale.
            </p>
          </div>
          <div className='grid gap-3 sm:grid-cols-2'>
            <label className='text-xs font-semibold text-muted-foreground'>
              Classification
              <select
                value={selection.classification}
                onChange={(event) =>
                  navigate({ classification: event.target.value })
                }
                className='mt-1 block min-w-56 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground'
              >
                <option value='market'>All roles</option>
                {state.classifications.map((ticker) => (
                  <option key={ticker.slug} value={ticker.slug}>
                    {ticker.label}
                  </option>
                ))}
              </select>
            </label>
            <label className='text-xs font-semibold text-muted-foreground'>
              History
              <select
                value={selection.range}
                onChange={(event) =>
                  navigate({ range: event.target.value as Range })
                }
                className='mt-1 block min-w-36 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground'
              >
                <option value='max'>Maximum</option>
                <option value='365'>1 year</option>
                <option value='90'>90 days</option>
              </select>
            </label>
          </div>
        </div>

        <div className='mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          <Metric
            icon={BriefcaseBusinessIcon}
            label='Open jobs'
            value={compactNumber(scopeTicker.current.activeJobs)}
            detail={`${compactNumber(scopeTicker.current.newJobs)} first observed on the latest day`}
          />
          <Metric
            icon={Building2Icon}
            label='Hiring companies'
            value={compactNumber(scopeTicker.current.hiringCompanies)}
            detail='Distinct employers with an open role'
          />
          <Metric
            icon={ChartNoAxesCombinedIcon}
            label='Demand pulse'
            value={relativeMomentumLabel(scopeTicker.momentum)}
            detail='7-day median versus the preceding 28-day baseline'
          />
          <Metric
            icon={CircleDollarSignIcon}
            label='Published salaries'
            value={compactNumber(
              (remote?.sampleCount ?? 0) + (local?.sampleCount ?? 0),
            )}
            detail='Filtered, deduplicated USD-converted observations'
          />
        </div>
      </section>

      <section className='grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,.7fr)]'>
        <div className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
          <h2 className='text-2xl font-bold'>Opportunity map</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            Area represents current open jobs. Color shows demand change
            relative to the market, which prevents a bulk import from making
            every role look bullish.
          </p>
          <FlintEChart
            option={treemap}
            className='mt-4 h-[32rem] w-full'
            ariaLabel='Crypto job classifications sized by open jobs and colored by market-relative demand'
            onSelect={(entry) => {
              if (typeof entry.slug === 'string') {
                navigate({ classification: entry.slug });
              }
            }}
          />
        </div>
        <div className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
          <h2 className='text-xl font-bold'>Unusual moves</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            Broad roles moving differently from the overall market.
          </p>
          <div className='mt-4'>
            {[...state.movers.bullish, ...state.movers.cooling]
              .slice(0, 12)
              .map((ticker) => (
                <ClassificationMove key={ticker.slug} ticker={ticker} />
              ))}
          </div>
        </div>
      </section>

      <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
        <div className='flex items-start gap-3'>
          <Globe2Icon className='mt-1 size-6 text-cyan-400' aria-hidden />
          <div>
            <h2 className='text-2xl font-bold'>Local pay geography</h2>
            <p className='mt-1 max-w-4xl text-sm text-muted-foreground'>
              Onsite and hybrid roles are grouped by continent; remote roles are
              kept separate so San Francisco and New York salaries cannot
              distort the remote benchmark. Countries inherit the continent
              estimate because country-level evidence is still sparse.
            </p>
          </div>
        </div>
        <div className='mt-5 grid gap-3 md:grid-cols-2'>
          <CompensationCard title='Remote benchmark' compensation={remote} />
          <CompensationCard title='Local benchmark' compensation={local} />
        </div>
        <div className='mt-5'>
          <MarketGeographyMap
            geography={state.geography}
            classification={selection.classification}
          />
        </div>
      </section>

      {detail && <SkillDetail detail={detail} mode={selection.mode} />}

      <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
        <div className='flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between'>
          <div>
            <div className='flex items-center gap-2 text-xs font-semibold tracking-widest text-violet-400 uppercase'>
              <SparklesIcon className='size-4' aria-hidden />
              Skill alpha matrix
            </div>
            <h2 className='mt-2 text-2xl font-bold'>
              What skills are worth now
            </h2>
            <p className='mt-1 max-w-3xl text-sm text-muted-foreground'>
              Raw pay is useful; adjusted repricing asks whether the same skill
              became more valuable after role, seniority, work mode, geography,
              and employer concentration are controlled.
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            {(['remote', 'local'] as const).map((mode) => (
              <button
                key={mode}
                type='button'
                onClick={() => navigate({ mode, skill: null })}
                className={cn(
                  'rounded-lg border px-4 py-2 text-sm font-semibold capitalize',
                  selection.mode === mode
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-background text-muted-foreground',
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className='mt-5 grid gap-3 lg:grid-cols-[minmax(260px,1fr)_minmax(220px,.45fr)]'>
          <form onSubmit={submitSearch} className='relative'>
            <SearchIcon
              className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground'
              aria-hidden
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder='Search skills'
              aria-label='Search skills'
              className='w-full rounded-lg border border-border bg-background py-2.5 pr-24 pl-10 text-sm outline-none focus:border-emerald-500'
            />
            <button
              type='submit'
              className='absolute top-1/2 right-1 -translate-y-1/2 rounded-md bg-foreground px-3 py-1.5 text-xs font-bold text-background'
            >
              Search
            </button>
          </form>
          <select
            value={selection.sort}
            onChange={(event) =>
              navigate({ sort: event.target.value as SkillSort, skill: null })
            }
            aria-label='Sort skills'
            className='rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground'
          >
            {TRENDS.map((trend) => (
              <option key={trend.value} value={trend.value}>
                {trend.label}
              </option>
            ))}
          </select>
        </div>

        <div className='mt-4 overflow-x-auto rounded-xl border border-border/60'>
          <table className='w-full min-w-[900px] text-left text-sm'>
            <thead className='bg-background/60 text-xs text-muted-foreground uppercase'>
              <tr>
                <th className='px-4 py-3'>Skill</th>
                <th className='px-4 py-3'>Monthly pay</th>
                <th className='px-4 py-3'>Adjusted repricing</th>
                <th className='px-4 py-3'>Demand vs market</th>
                <th className='px-4 py-3'>Open jobs</th>
                <th className='px-4 py-3'>Evidence</th>
                <th className='px-4 py-3'>Explore</th>
              </tr>
            </thead>
            <tbody>
              {skills.skills.map((skill) => (
                <tr
                  key={skill.slug}
                  className={cn(
                    'border-t border-border/50',
                    selection.skill === skill.slug && 'bg-emerald-500/[0.06]',
                  )}
                >
                  <td className='px-4 py-3'>
                    <strong>{skill.label}</strong>
                    {skill.strongBreakout && (
                      <span className='ml-2 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase'>
                        Breakout
                      </span>
                    )}
                  </td>
                  <td className='px-4 py-3 font-semibold'>
                    {monthlySalary(skill.current.medianMonthlyUsd)}
                  </td>
                  <td className='px-4 py-3'>
                    <SignalBadge signal={skill.signal} />
                  </td>
                  <td
                    className={cn(
                      'px-4 py-3 font-semibold',
                      (skill.momentum.marketRelativeScore ?? 0) >= 5 &&
                        'text-emerald-400',
                      (skill.momentum.marketRelativeScore ?? 0) <= -5 &&
                        'text-rose-400',
                    )}
                  >
                    {relativeMomentumLabel(skill.momentum)}
                  </td>
                  <td className='px-4 py-3'>
                    {compactNumber(skill.activeJobs)}
                    <span className='block text-xs text-muted-foreground'>
                      {compactNumber(skill.hiringCompanies)} employers
                    </span>
                  </td>
                  <td className='px-4 py-3 text-muted-foreground'>
                    {skill.current.sampleCount} salaries
                    <span className='block text-xs'>
                      {skill.current.employerCount} employers
                    </span>
                  </td>
                  <td className='px-4 py-3'>
                    <button
                      type='button'
                      onClick={() => {
                        navigate({ skill: skill.slug });
                      }}
                      className='font-semibold text-emerald-400 hover:underline'
                    >
                      Analyze
                    </button>
                    <Link
                      href={`/${getFrontendSlug(skill.slug)}`}
                      className='ml-3 text-muted-foreground hover:text-foreground'
                    >
                      Jobs
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {skills.skills.length === 0 && (
            <div className='px-6 py-12 text-center'>
              <p className='font-semibold'>
                No publishable skill signals found
              </p>
              <p className='mt-1 text-sm text-muted-foreground'>
                Try a broader search, another view, or the other work mode.
              </p>
            </div>
          )}
        </div>
        <p className='mt-3 text-xs text-muted-foreground'>
          Showing {skills.skills.length} skills with at least five salary
          samples from three employers. Estimates are only printed at ten
          salaries from five employers; stronger repricing signals have stricter
          thresholds.
        </p>
      </section>

      <section className='rounded-xl border border-border/60 bg-background/45 p-4 text-xs text-muted-foreground'>
        <strong className='text-foreground'>How to read this page.</strong> Job
        activity is reconstructed from first/last observation dates and then
        continued with exact daily snapshots. Compensation uses the exchange
        rate from the job’s observation date. Repricing signals require at least
        20 jobs and 10 employers in both comparison windows, seven observed
        dates, no single date contributing over 40%, a meaningful 5% move, a 95%
        confidence interval excluding zero, correction for testing many skills,
        and persistence across three snapshots. Sparse estimates remain visible
        as missing evidence, not zeros.
      </section>
    </div>
  );
};
