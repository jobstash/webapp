'use client';

import Link from 'next/link';
import { useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
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
import { activityChartOption, marketTreemapOption } from './chart-options';
import { CompensationBandChart } from './compensation-band-chart';
import { FlintEChart } from './flint-echart';
import { MarketGeographyMap } from './market-geography-map';
import { compactNumber, monthlySalary, percentLabel } from '../lib/format';
import { hasPublishableSkillCompensation } from '../lib/skill-evidence';
import type {
  JobMarketCompensation,
  JobMarketSkillList,
  JobMarketState,
  JobMarketTicker,
  PillarMarket,
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
  { value: 'breakout', label: 'Most relevant' },
  { value: 'repricing', label: 'Verified pay increases' },
  { value: 'salary', label: 'Highest pay' },
  { value: 'demand', label: 'New postings rising' },
  { value: 'cooling', label: 'New postings cooling' },
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
    <p className='mt-2 text-xs text-muted-foreground'>
      {compensation?.activeJobs ?? 0} open jobs at{' '}
      {compensation?.hiringCompanies ?? 0} hiring companies
    </p>
    {compensation?.segment === 'local' && (
      <p className='mt-2 text-xs text-muted-foreground'>
        {compensation.activeOnsiteJobs} open onsite ·{' '}
        {compensation.activeHybridJobs} open hybrid
      </p>
    )}
  </div>
);

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
      {percentLabel(
        ticker.activity.marketComparison.openInventoryPercentagePoints,
      )}{' '}
      points
    </span>
  </Link>
);

export const MarketStateDashboard = ({
  state,
  skills,
  scopeMarket,
  selection,
}: {
  state: JobMarketState;
  skills: JobMarketSkillList;
  scopeMarket: PillarMarket | null;
  selection: Selection;
}) => {
  const router = useRouter();
  const [query, setQuery] = useState(selection.query);
  const selectedClassification = state.selectedClassification;
  const treemap = useMemo(
    () => marketTreemapOption(state.classifications),
    [state.classifications],
  );
  const activityChart = useMemo(
    () => activityChartOption(scopeMarket?.history ?? []),
    [scopeMarket],
  );
  const paramsFor = (updates: Partial<Selection>) => {
    const next = {
      ...selection,
      classification: selectedClassification,
      ...updates,
    };
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
    selectedClassification === 'market'
      ? state.market
      : (state.classifications.find(
          (ticker) => ticker.slug === selectedClassification,
        ) ?? state.market);
  const scoped = selectedClassification !== 'market';
  const scopeLabel = state.selectedClassificationLabel;
  const scopePillar = getFrontendSlug(selectedClassification);
  const publishableSkills = skills.skills.filter(
    hasPublishableSkillCompensation,
  );
  const publishableSignals = publishableSkills.filter(
    (skill) =>
      skill.signal &&
      skill.signal.status !== 'insufficient' &&
      skill.current.reliable,
  );

  return (
    <div className='space-y-6 pb-16'>
      <section className='relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 px-5 py-8 md:px-8 md:py-10'>
        <div className='pointer-events-none absolute -top-24 right-0 size-80 rounded-full bg-emerald-500/10 blur-3xl' />
        <div className='relative max-w-4xl'>
          <div className='flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-emerald-400 uppercase'>
            <ChartNoAxesCombinedIcon className='size-4' aria-hidden />
            {scoped
              ? `${scopeLabel} market intelligence`
              : 'State of the crypto job market'}
          </div>
          <h1 className='mt-3 text-4xl font-black tracking-tight md:text-6xl'>
            {scoped
              ? `${scopeLabel} jobs market`
              : 'Hiring intelligence you can act on'}
          </h1>
          <p className='mt-4 max-w-3xl text-base text-muted-foreground md:text-lg'>
            {scoped
              ? `Open ${scopeLabel.toLowerCase()} opportunities, hiring activity, listed compensation, local salary geography, and the skills employers ask for.`
              : 'See which roles are heating up, where local jobs pay best, and which skills are gaining value after accounting for job mix—not just raw salary averages.'}
          </p>
          {scoped && (
            <div className='mt-6 flex flex-wrap gap-3'>
              <Link
                href={`/${scopePillar}`}
                className='rounded-lg bg-foreground px-4 py-2.5 text-sm font-bold text-background'
              >
                Browse {compactNumber(scopeTicker.current.activeJobs)} open{' '}
                {scopeLabel} jobs
              </Link>
              <Link
                href='/market'
                className='rounded-lg border border-border bg-background/60 px-4 py-2.5 text-sm font-bold'
              >
                Back to the full market
              </Link>
            </div>
          )}
          <p className='mt-4 text-xs text-muted-foreground'>
            Complete through {state.completeThrough} · Daily hiring activity ·
            Weekly compensation · Historical exchange rates
          </p>
        </div>
      </section>

      <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
        <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
          <div>
            <h2 className='text-2xl font-bold'>Market scope</h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              Pick one role family and history window. All figures below follow
              that selection.
            </p>
          </div>
          <div className='grid gap-3 sm:grid-cols-2'>
            <label className='text-xs font-semibold text-muted-foreground'>
              Classification
              <select
                value={selectedClassification}
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
            detail='Currently actionable roles in this selection'
          />
          <Metric
            icon={Building2Icon}
            label='Hiring companies'
            value={compactNumber(scopeTicker.current.hiringCompanies)}
            detail='Distinct employers with an open role'
          />
          <Metric
            icon={ChartNoAxesCombinedIcon}
            label='New postings'
            value={compactNumber(scopeTicker.activity.newPostings.current)}
            detail={`${percentLabel(scopeTicker.activity.newPostings.percentChange)} vs the previous 7 days`}
          />
          <Metric
            icon={CircleDollarSignIcon}
            label='Open-job change'
            value={percentLabel(
              scopeTicker.activity.openInventory.percentChange,
            )}
            detail={`7-day median vs preceding 28 days${
              scopeTicker.activity.marketComparison
                .openInventoryPercentagePoints === null
                ? ''
                : ` · ${percentLabel(
                    scopeTicker.activity.marketComparison
                      .openInventoryPercentagePoints,
                  )} points vs market`
            }`}
          />
        </div>
      </section>

      {scopeMarket && (
        <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
          <h2 className='text-2xl font-bold'>
            {scoped
              ? `${scopeLabel} hiring activity`
              : 'Market hiring activity'}
          </h2>
          <p className='mt-1 max-w-4xl text-sm text-muted-foreground'>
            Open roles and hiring employers are current inventory. New postings
            are counted when a job first enters the corpus.
          </p>
          <FlintEChart
            option={activityChart}
            className='mt-4 h-80 w-full'
            ariaLabel={`${scopeLabel} open jobs, hiring employers, and new postings over time`}
          />
        </section>
      )}

      {!scoped && (
        <section className='grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,.7fr)]'>
          <div className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
            <h2 className='text-2xl font-bold'>Opportunity map</h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              Area represents current open jobs. Color shows each role's
              open-inventory change minus the overall market change.
            </p>
            <FlintEChart
              option={treemap}
              className='mt-4 h-[32rem] w-full'
              ariaLabel='Crypto job classifications sized by open jobs and colored by open-inventory change relative to the market'
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
      )}

      <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
        <div className='flex items-start gap-3'>
          <Globe2Icon className='mt-1 size-6 text-cyan-400' aria-hidden />
          <div>
            <h2 className='text-2xl font-bold'>Local pay geography</h2>
            <p className='mt-1 max-w-4xl text-sm text-muted-foreground'>
              Country estimates use onsite and hybrid listings. Remote roles
              stay separate so high-cost local markets cannot distort the remote
              benchmark. Sparse countries use a clearly labelled continent
              fallback.
            </p>
          </div>
        </div>
        <div className='mt-5 grid gap-3 md:grid-cols-2'>
          <CompensationCard title='Remote benchmark' compensation={remote} />
          <CompensationCard title='Local benchmark' compensation={local} />
        </div>
        {state.compensationBands.some((band) => band.reliable) && (
          <div className='mt-6 border-t border-border/50 pt-6'>
            <h3 className='text-lg font-bold'>
              Listed compensation by seniority
            </h3>
            <p className='mt-1 text-sm text-muted-foreground'>
              Median and middle 50% of USD-converted monthly compensation.
              Statistical salary history includes open and offline jobs.
            </p>
            <CompensationBandChart bands={state.compensationBands} />
          </div>
        )}
        <div className='mt-5'>
          <MarketGeographyMap
            geography={state.geography}
            classification={selectedClassification}
          />
        </div>
      </section>

      <section
        id='skill-explorer'
        className='scroll-mt-24 rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'
      >
        <div className='flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between'>
          <div>
            <div className='flex items-center gap-2 text-xs font-semibold tracking-widest text-violet-400 uppercase'>
              <SparklesIcon className='size-4' aria-hidden />
              {scoped
                ? `Compensation in ${scopeLabel}`
                : 'Skill pay benchmarks'}
            </div>
            <h2 className='mt-2 text-2xl font-bold'>
              {scoped
                ? `What skills are worth in ${scopeLabel}`
                : 'What skills are worth now'}
            </h2>
            <p className='mt-1 max-w-3xl text-sm text-muted-foreground'>
              Only skills with publishable compensation evidence are shown.
              Salary statistics use open and historical closed listings; open
              job counts remain current.
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

        <div
          className={cn(
            'mt-5 grid gap-3',
            !scoped && 'lg:grid-cols-[minmax(260px,1fr)_minmax(220px,.45fr)]',
          )}
        >
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
          {!scoped && (
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
          )}
        </div>

        <div className='mt-4 overflow-x-auto rounded-xl border border-border/60'>
          <table className='w-full min-w-[940px] text-left text-sm'>
            <thead className='bg-background/60 text-xs text-muted-foreground uppercase'>
              <tr>
                <th className='px-4 py-3'>Skill</th>
                <th className='px-4 py-3'>Monthly pay</th>
                <th className='px-4 py-3'>Middle 50%</th>
                <th className='px-4 py-3'>Open jobs</th>
                <th className='px-4 py-3'>Hiring employers</th>
                <th className='px-4 py-3'>Evidence</th>
                <th className='px-4 py-3'>Explore</th>
              </tr>
            </thead>
            <tbody>
              {publishableSkills.map((skill) => (
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
                  <td className='px-4 py-3 whitespace-nowrap text-muted-foreground'>
                    {monthlySalary(skill.current.p25MonthlyUsd)} –{' '}
                    {monthlySalary(skill.current.p75MonthlyUsd)}
                  </td>
                  <td className='px-4 py-3'>
                    {compactNumber(skill.activeJobs)}
                  </td>
                  <td className='px-4 py-3'>
                    {compactNumber(skill.hiringCompanies)}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    {compactNumber(skill.current.sampleCount)} salaries
                    <span className='block text-xs text-muted-foreground'>
                      {compactNumber(skill.current.employerCount)} employers
                    </span>
                  </td>
                  <td className='px-4 py-3'>
                    {!scoped && (
                      <button
                        type='button'
                        onClick={() => {
                          navigate({ skill: skill.slug });
                        }}
                        className='font-semibold text-emerald-400 hover:underline'
                      >
                        Analyze
                      </button>
                    )}
                    <Link
                      href={`/${getFrontendSlug(skill.slug)}`}
                      className={cn(
                        'text-muted-foreground hover:text-foreground',
                        !scoped && 'ml-3',
                      )}
                    >
                      Browse jobs
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {publishableSkills.length === 0 && (
            <div className='px-6 py-12 text-center'>
              <p className='font-semibold'>
                No skills have publishable compensation evidence in this
                selection
              </p>
              <p className='mt-1 text-sm text-muted-foreground'>
                Try a broader classification, another work mode, or a different
                search.
              </p>
            </div>
          )}
        </div>
        <p className='mt-3 text-xs text-muted-foreground'>
          Showing {publishableSkills.length}{' '}
          {publishableSkills.length === 1 ? 'skill' : 'skills'} with publishable
          compensation: at least 20 salary listings from 10 employers.
        </p>
      </section>

      {publishableSignals.length > 0 && (
        <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
          <h2 className='text-2xl font-bold'>Verified skill value moves</h2>
          <p className='mt-1 max-w-3xl text-sm text-muted-foreground'>
            Only statistically supported changes are shown. Listed pay is
            adjusted for role, seniority, work mode, geography, and employer
            concentration.
          </p>
          <div className='mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
            {publishableSignals.slice(0, 9).map((skill) => (
              <Link
                key={skill.slug}
                href={paramsFor({ skill: skill.slug })}
                className='rounded-xl border border-border/60 bg-background/50 p-4 transition-colors hover:border-emerald-500/50'
              >
                <strong>{skill.label}</strong>
                <span className='mt-3 block text-2xl font-bold text-emerald-400'>
                  {percentLabel(skill.signal?.adjustedChangePercent ?? null)}
                </span>
                <span className='mt-1 block text-xs text-muted-foreground'>
                  {monthlySalary(skill.current.medianMonthlyUsd)} ·{' '}
                  {skill.current.sampleCount} salaries from{' '}
                  {skill.current.employerCount} employers
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className='rounded-xl border border-border/60 bg-background/45 p-4 text-xs text-muted-foreground'>
        <strong className='text-foreground'>How to read this page.</strong> Job
        activity is reconstructed from first/last observation dates and then
        continued with exact daily snapshots. Compensation uses the exchange
        rate from the job’s observation date. Repricing signals require at least
        20 jobs and 10 employers in both comparison windows, seven observed
        dates, no single date contributing over 40%, a meaningful 5% move, a 95%
        confidence interval excluding zero, correction for testing many skills,
        and persistence across three snapshots. Skills without enough
        compensation evidence are omitted from the pay table rather than shown
        as missing values.
      </section>
    </div>
  );
};
