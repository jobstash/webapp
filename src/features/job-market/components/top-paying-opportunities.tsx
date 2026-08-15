'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowUpRightIcon,
  BriefcaseBusinessIcon,
  CircleDollarSignIcon,
  MapPinIcon,
  TrophyIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { getFrontendSlug } from '@/features/pillar/constants';
import { compactNumber, monthlySalary } from '../lib/format';
import type {
  JobMarketTopPaying,
  JobMarketTopPayingBreakdown,
} from '../schemas';

type Segment = 'remote' | 'local';
type BreakdownKey = 'classifications' | 'tags' | 'seniorities';

const BREAKDOWNS: Array<{ key: BreakdownKey; label: string }> = [
  { key: 'classifications', label: 'Role families' },
  { key: 'tags', label: 'Skills' },
  { key: 'seniorities', label: 'Seniority' },
];

const REGION_ORDER: Record<string, number> = {
  aggregate: 0,
  continent: 1,
  country: 2,
  region: 3,
  city: 4,
};

const REGION_GROUPS: Record<string, string> = {
  aggregate: 'All local jobs',
  continent: 'Continents',
  country: 'Countries',
  region: 'Regions',
  city: 'Cities',
};

const annualSalary = (monthly: number | null): string => {
  if (monthly === null) return '—';
  return `${new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 0,
  }).format(monthly * 12)}/yr`;
};

const breakdownHref = (item: JobMarketTopPayingBreakdown): string =>
  `/${getFrontendSlug(item.slug)}`;

interface Props {
  data: JobMarketTopPaying;
  mode: Segment;
  onModeChange: (mode: Segment) => void;
  onRegionChange: (region: string) => void;
}

export const TopPayingOpportunities = ({
  data,
  mode,
  onModeChange,
  onRegionChange,
}: Props) => {
  const [breakdown, setBreakdown] = useState<BreakdownKey>('classifications');
  const regions = useMemo(() => {
    const unique = new Map<
      string,
      JobMarketTopPaying['availableRegions'][number]
    >();
    for (const region of data.availableRegions) {
      unique.set(`${region.regionType}:${region.regionSlug}`, region);
    }
    return [...unique.values()].sort(
      (left, right) =>
        (REGION_ORDER[left.regionType] ?? 99) -
          (REGION_ORDER[right.regionType] ?? 99) ||
        left.regionLabel.localeCompare(right.regionLabel),
    );
  }, [data.availableRegions]);
  const selectedRegion = `${data.scope.regionType}:${data.scope.regionSlug}`;
  const analysis = data.breakdowns[breakdown];
  const largestGroup = Math.max(1, ...analysis.map((item) => item.jobCount));
  const browseParams = new URLSearchParams();
  if (data.scope.classification !== 'market') {
    browseParams.set(
      'classifications',
      data.scope.classification.replace(/^cl-/, ''),
    );
  }
  browseParams.set('workModes', mode === 'remote' ? 'remote' : 'onsite,hybrid');
  if (data.scope.filter) {
    browseParams.set(data.scope.filter.paramKey, data.scope.filter.value);
  }
  const browseHref = `/?${browseParams.toString()}`;
  const locationLabel = (job: JobMarketTopPaying['jobs'][number]): string => {
    if (mode === 'local' && data.scope.regionType !== 'aggregate') {
      if (
        job.location &&
        !job.location
          .toLocaleLowerCase()
          .includes(data.scope.regionLabel.toLocaleLowerCase())
      ) {
        return `Matches ${data.scope.regionLabel} · listed as ${job.location}`;
      }
      return data.scope.regionLabel;
    }
    return job.location || data.scope.regionLabel;
  };

  return (
    <section
      id='top-paying-opportunities'
      className='scroll-mt-24 overflow-hidden rounded-2xl border border-amber-400/25 bg-card/70'
    >
      <div className='border-b border-border/60 bg-linear-to-br from-amber-400/[0.09] via-transparent to-emerald-400/[0.05] p-4 md:p-6'>
        <div className='flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between'>
          <div>
            <div className='flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-amber-300 uppercase'>
              <TrophyIcon className='size-4' aria-hidden />
              Top-paying opportunities
            </div>
            <h2 className='mt-2 text-3xl font-black tracking-tight'>
              What the top 10% of open jobs pay
            </h2>
            <p className='mt-2 max-w-4xl text-sm text-muted-foreground'>
              We take current jobs with a listed salary, convert each one to
              monthly USD, and recalculate the highest-paid 10% for the work
              mode and location you choose. Every job below is open now.
            </p>
          </div>
          <div className='flex flex-wrap gap-2' aria-label='Top pay work mode'>
            {(['remote', 'local'] as const).map((segment) => (
              <button
                key={segment}
                type='button'
                aria-pressed={mode === segment}
                onClick={() => onModeChange(segment)}
                className={cn(
                  'rounded-lg border px-4 py-2 text-sm font-bold',
                  mode === segment
                    ? 'border-amber-300 bg-amber-300 text-black'
                    : 'border-border bg-background/70 text-muted-foreground hover:text-foreground',
                )}
              >
                {segment === 'remote' ? 'Remote' : 'Onsite & hybrid'}
              </button>
            ))}
          </div>
        </div>

        {mode === 'local' && (
          <label className='mt-5 block max-w-xl text-xs font-semibold text-muted-foreground'>
            Continent, country, region, or city
            <select
              value={selectedRegion}
              onChange={(event) => onRegionChange(event.target.value)}
              className='mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground'
            >
              {Object.entries(REGION_GROUPS).map(([regionType, label]) => {
                const options = regions.filter(
                  (region) => region.regionType === regionType,
                );
                if (options.length === 0) return null;
                return (
                  <optgroup key={regionType} label={label}>
                    {options.map((region) => (
                      <option
                        key={`${region.regionType}:${region.regionSlug}`}
                        value={`${region.regionType}:${region.regionSlug}`}
                      >
                        {region.regionLabel} ·{' '}
                        {compactNumber(region.activeJobs)}
                        {' jobs · '}
                        {compactNumber(region.salarySampleCount)} salaries
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </label>
        )}
      </div>

      <div className='p-4 md:p-6'>
        <div className='grid gap-3 sm:grid-cols-3'>
          <div className='rounded-xl border border-border/60 bg-background/50 p-4'>
            <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase'>
              <CircleDollarSignIcon className='size-4' aria-hidden />
              Top 10% starts at
            </div>
            <strong className='mt-3 block text-2xl'>
              {monthlySalary(data.topDecileThresholdMonthlyUsd)}
            </strong>
            <span className='mt-1 block text-xs text-muted-foreground'>
              {annualSalary(data.topDecileThresholdMonthlyUsd)} equivalent
            </span>
          </div>
          <div className='rounded-xl border border-border/60 bg-background/50 p-4'>
            <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase'>
              <TrophyIcon className='size-4' aria-hidden />
              Typical pay in the top 10%
            </div>
            <strong className='mt-3 block text-2xl'>
              {monthlySalary(data.medianTopDecileMonthlyUsd)}
            </strong>
            <span className='mt-1 block text-xs text-muted-foreground'>
              {annualSalary(data.medianTopDecileMonthlyUsd)} equivalent
            </span>
          </div>
          <div className='rounded-xl border border-border/60 bg-background/50 p-4'>
            <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase'>
              <BriefcaseBusinessIcon className='size-4' aria-hidden />
              Salary coverage
            </div>
            <strong className='mt-3 block text-2xl'>
              {compactNumber(data.salaryJobCount)} of{' '}
              {compactNumber(data.openJobsInScope)}
            </strong>
            <span className='mt-1 block text-xs text-muted-foreground'>
              {data.salaryCoveragePercent.toFixed(1)}% of open jobs in{' '}
              {data.scope.regionLabel}
            </span>
          </div>
        </div>

        {data.topDecileJobCount > 0 ? (
          <>
            <div className='mt-6 grid gap-6 xl:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]'>
              <div>
                <div className='flex flex-wrap gap-2'>
                  {BREAKDOWNS.map((item) => (
                    <button
                      key={item.key}
                      type='button'
                      aria-pressed={breakdown === item.key}
                      onClick={() => setBreakdown(item.key)}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-xs font-bold',
                        breakdown === item.key
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border text-muted-foreground',
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <h3 className='mt-4 text-lg font-bold'>
                  What appears most often in the top 10%
                </h3>
                <p className='mt-1 text-xs text-muted-foreground'>
                  Bar length is the number of top-paying jobs. The pay figure is
                  the median within each group. Select a row to browse its jobs.
                </p>
                <div className='mt-4 space-y-3'>
                  {analysis.map((item) => (
                    <Link
                      key={item.slug}
                      href={breakdownHref(item)}
                      className='group block rounded-lg border border-border/50 bg-background/45 p-3 hover:border-amber-300/40'
                    >
                      <div className='flex items-center justify-between gap-3 text-sm'>
                        <strong>{item.label}</strong>
                        <span className='text-right text-xs text-muted-foreground'>
                          {item.jobCount} {item.jobCount === 1 ? 'job' : 'jobs'}{' '}
                          · {monthlySalary(item.medianMonthlyUsd)}
                        </span>
                      </div>
                      <div className='mt-2 h-1.5 overflow-hidden rounded-full bg-muted'>
                        <div
                          className='h-full rounded-full bg-linear-to-r from-amber-300 to-emerald-400 transition-[width]'
                          style={{
                            width: `${Math.max(4, (item.jobCount / largestGroup) * 100)}%`,
                          }}
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className='flex flex-wrap items-end justify-between gap-3'>
                  <div>
                    <h3 className='text-lg font-bold'>
                      Highest listed salaries
                    </h3>
                    <p className='mt-1 text-xs text-muted-foreground'>
                      Showing {data.jobs.length} of{' '}
                      {compactNumber(data.topDecileJobCount)} current top-decile
                      jobs.
                    </p>
                  </div>
                  <Link
                    href={browseHref}
                    className='text-xs font-bold text-amber-300 hover:underline'
                  >
                    Browse all jobs in this scope
                  </Link>
                </div>
                <div className='mt-4 grid gap-3'>
                  {data.jobs.map((job) => (
                    <article
                      key={job.id}
                      className='rounded-xl border border-border/60 bg-background/50 p-4'
                    >
                      <div className='flex items-start justify-between gap-4'>
                        <div className='min-w-0'>
                          <Link
                            href={job.href}
                            className='font-bold hover:text-amber-300 hover:underline'
                          >
                            {job.title}
                          </Link>
                          <p className='mt-1 text-xs text-muted-foreground'>
                            {job.organizationName ?? 'Organization not listed'}
                          </p>
                        </div>
                        <div className='shrink-0 text-right'>
                          <strong className='block text-emerald-300'>
                            {monthlySalary(job.salaryMonthlyUsd)}
                          </strong>
                          <span className='text-[11px] text-muted-foreground'>
                            {annualSalary(job.salaryMonthlyUsd)}
                          </span>
                        </div>
                      </div>
                      <div className='mt-3 flex flex-wrap gap-1.5 text-[11px]'>
                        <span className='inline-flex items-center gap-1 rounded-full border border-border px-2 py-1 text-muted-foreground'>
                          <MapPinIcon className='size-3' aria-hidden />
                          {locationLabel(job)}
                        </span>
                        <span className='rounded-full border border-border px-2 py-1 text-muted-foreground capitalize'>
                          {job.workModes.join(' · ') || mode}
                        </span>
                        <Link
                          href={`/${getFrontendSlug(job.classificationSlug)}`}
                          className='rounded-full border border-border px-2 py-1 hover:border-amber-300/40'
                        >
                          {job.classificationLabel}
                        </Link>
                        {job.senioritySlug && job.seniorityLabel && (
                          <Link
                            href={`/${job.senioritySlug}`}
                            className='rounded-full border border-border px-2 py-1 hover:border-amber-300/40'
                          >
                            {job.seniorityLabel}
                          </Link>
                        )}
                      </div>
                      <div className='mt-3 flex flex-wrap items-center gap-x-3 gap-y-1'>
                        {job.tags.slice(0, 4).map((tag) => (
                          <Link
                            key={tag.slug}
                            href={`/${getFrontendSlug(tag.slug)}`}
                            className='text-[11px] text-muted-foreground hover:text-foreground'
                          >
                            {tag.label}
                          </Link>
                        ))}
                        <Link
                          href={job.href}
                          className='ml-auto inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:underline'
                        >
                          View job
                          <ArrowUpRightIcon className='size-3' aria-hidden />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className='mt-5 rounded-xl border border-dashed border-border p-8 text-center'>
            <p className='font-semibold'>
              No open jobs in this scope currently list a usable salary
            </p>
            <p className='mt-1 text-sm text-muted-foreground'>
              Choose another location or switch work mode to compare the data
              that is available elsewhere.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
