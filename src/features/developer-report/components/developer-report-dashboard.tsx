'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import {
  Building2Icon,
  DatabaseIcon,
  GitBranchIcon,
  GitCommitHorizontalIcon,
  ShieldCheckIcon,
  UserRoundCheckIcon,
  UsersRoundIcon,
} from 'lucide-react';

import { FlintEChart } from '@/features/job-market/components/flint-echart';
import { cn } from '@/lib/utils';
import type { DeveloperReport, DeveloperReportRange } from '../schemas';
import {
  cadenceChartOption,
  growthChartOption,
  tenureChartOption,
  workforceChartOption,
  workChartOption,
} from './chart-options';
import { OrganizationBubbleTimeline } from './organization-bubble-timeline';

const ranges: Array<{ key: DeveloperReportRange; label: string }> = [
  { key: '3m', label: '3 months' },
  { key: '6m', label: '6 months' },
  { key: '1y', label: '1 year' },
  { key: '3y', label: '3 years' },
  { key: 'max', label: 'Max' },
];

const compact = (value: number) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

const reportHref = (
  report: DeveloperReport,
  next: {
    vertical?: string | null;
    chain?: string | null;
    range?: DeveloperReportRange;
  },
) => {
  const vertical =
    next.vertical === undefined ? report.scope.vertical : next.vertical;
  const chain = next.chain === undefined ? report.scope.chain : next.chain;
  const range = next.range ?? report.range.key;
  const path = chain ? `/developers/chains/${chain}` : '/developers';
  const search = new URLSearchParams();
  if (vertical) search.set('vertical', vertical);
  if (range !== 'max') search.set('range', range);
  return search.size ? `${path}?${search}` : path;
};

const Metric = ({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof UsersRoundIcon;
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

const ChartCard = ({
  title,
  description,
  option,
}: {
  title: string;
  description: string;
  option: ReturnType<typeof workforceChartOption>;
}) => (
  <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
    <h2 className='text-2xl font-bold'>{title}</h2>
    <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
    <FlintEChart
      option={option}
      className='mt-4 h-80 w-full'
      ariaLabel={title}
    />
  </section>
);

const ScopeSelector = ({ report }: { report: DeveloperReport }) => (
  <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
    <div className='flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between'>
      <div>
        <h2 className='text-2xl font-bold'>Verticals and chains</h2>
        <p className='mt-1 max-w-3xl text-sm text-muted-foreground'>
          Current verticals are exclusive and restate the complete history.
          Chains overlap. Selecting one of each applies both filters to every
          panel.
        </p>
      </div>
      <span className='text-xs text-muted-foreground'>
        {report.coverage.organizationPercent.toFixed(1)}% organization ·{' '}
        {report.coverage.developerPercent.toFixed(1)}% developer coverage
      </span>
    </div>

    <div className='mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      <Link
        href={reportHref(report, { vertical: null })}
        className={cn(
          'rounded-xl border p-4 transition-colors',
          report.scope.vertical === null
            ? 'border-emerald-500/60 bg-emerald-500/10'
            : 'border-border/60 bg-background/50 hover:border-emerald-500/35',
        )}
      >
        <span className='text-xs font-semibold tracking-wide text-muted-foreground uppercase'>
          Overall
        </span>
        <strong className='mt-2 block text-2xl'>
          {compact(report.summary.activeDevelopers)}
        </strong>
        <span className='text-xs text-muted-foreground'>active developers</span>
      </Link>
      {report.scopes.verticals.map((vertical) => (
        <Link
          key={vertical.slug}
          href={reportHref(report, { vertical: vertical.slug })}
          aria-current={
            report.scope.vertical === vertical.slug ? 'page' : undefined
          }
          className={cn(
            'rounded-xl border p-4 transition-colors',
            report.scope.vertical === vertical.slug
              ? 'border-emerald-500/60 bg-emerald-500/10'
              : 'border-border/60 bg-background/50 hover:border-emerald-500/35',
          )}
        >
          <span className='text-xs font-semibold tracking-wide text-muted-foreground uppercase'>
            {vertical.label}
          </span>
          <strong className='mt-2 block text-2xl'>
            {compact(vertical.activeDevelopers)}
          </strong>
          <span className='text-xs text-muted-foreground'>
            {compact(vertical.internalDevelopers)} internal ·{' '}
            {compact(vertical.activeOrganizations)} orgs
          </span>
        </Link>
      ))}
    </div>

    <div className='mt-5 flex gap-2 overflow-x-auto pb-1'>
      {report.scope.chain ? (
        <Link
          href={reportHref(report, { chain: null })}
          className='shrink-0 rounded-full border border-border px-3 py-2 text-sm font-semibold hover:border-emerald-500/50'
        >
          Clear chain
        </Link>
      ) : null}
      {report.scopes.chains.map((chain) => (
        <Link
          key={chain.slug}
          href={reportHref(report, { chain: chain.slug })}
          aria-current={report.scope.chain === chain.slug ? 'page' : undefined}
          className={cn(
            'shrink-0 rounded-full border px-3 py-2 text-sm font-semibold',
            report.scope.chain === chain.slug
              ? 'border-sky-400/60 bg-sky-400/10'
              : 'border-border hover:border-sky-400/50',
          )}
        >
          {chain.label} · {compact(chain.activeDevelopers)}
        </Link>
      ))}
    </div>
  </section>
);

export const DeveloperReportDashboard = ({
  report,
}: {
  report: DeveloperReport;
}) => {
  const workforce = useMemo(
    () => workforceChartOption(report.history),
    [report.history],
  );
  const cadence = useMemo(
    () => cadenceChartOption(report.history),
    [report.history],
  );
  const tenure = useMemo(
    () => tenureChartOption(report.history),
    [report.history],
  );
  const growth = useMemo(
    () => growthChartOption(report.history),
    [report.history],
  );
  const work = useMemo(() => workChartOption(report.history), [report.history]);

  return (
    <main className='mx-auto w-full max-w-[1600px] space-y-6 px-4 py-8 md:px-8'>
      <header className='overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-6 md:p-9'>
        <p className='text-xs font-semibold tracking-[0.2em] text-emerald-400 uppercase'>
          Developer ecosystem report
        </p>
        <div className='mt-3 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between'>
          <div>
            <h1 className='text-4xl font-black tracking-tight md:text-6xl'>
              {report.scope.label}
            </h1>
            <p className='mt-3 max-w-4xl text-sm text-muted-foreground md:text-base'>
              {report.population.definition}
            </p>
          </div>
          <nav aria-label='Report range' className='flex flex-wrap gap-2'>
            {ranges.map((range) => (
              <Link
                key={range.key}
                href={reportHref(report, { range: range.key })}
                aria-current={
                  report.range.key === range.key ? 'page' : undefined
                }
                className={cn(
                  'rounded-full border px-3 py-2 text-sm font-bold',
                  report.range.key === range.key
                    ? 'border-emerald-400 bg-emerald-400/10 text-emerald-300'
                    : 'border-border/70 text-muted-foreground hover:text-foreground',
                )}
              >
                {range.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className='mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6'>
          <Metric
            icon={DatabaseIcon}
            label='Raw indexed records'
            value={compact(report.summary.rawIndexedCommitRecords)}
            detail='Corpus size; not credited work'
          />
          <Metric
            icon={GitCommitHorizontalIcon}
            label='Credited originals'
            value={compact(report.summary.creditedOriginalCommits)}
            detail='Provenance-approved commits'
          />
          <Metric
            icon={UsersRoundIcon}
            label='All contributors'
            value={compact(report.summary.allContributors)}
            detail='Numeric GitHub author IDs in raw activity'
          />
          <Metric
            icon={UserRoundCheckIcon}
            label='Active developers'
            value={compact(report.summary.activeDevelopers)}
            detail='Authors of credited originals'
          />
          <Metric
            icon={ShieldCheckIcon}
            label='Internal developers'
            value={compact(report.summary.internalDevelopers)}
            detail={`${(report.summary.internalDeveloperShare * 100).toFixed(1)}% of active developers`}
          />
          <Metric
            icon={Building2Icon}
            label='Maintainers · leads'
            value={`${compact(report.summary.maintainers)} · ${compact(report.summary.activeLeads)}`}
            detail={`${compact(report.summary.organizations)} organizations`}
          />
        </div>
      </header>

      <ScopeSelector report={report} />

      <div className='grid gap-6 xl:grid-cols-2'>
        <ChartCard
          title='Active developers over time'
          description='Raw participation, credited developers, and the nested internal, maintainer, and lead layers.'
          option={workforce}
        />
        <ChartCard
          title='Original work versus indexed corpus'
          description='Credited original commits are never conflated with all raw indexed commit records.'
          option={work}
        />
        <ChartCard
          title='Full-time, part-time, and one-time activity'
          description='Monthly segments use 10+, 2–9, and exactly 1 active day.'
          option={cadence}
        />
        <ChartCard
          title='Newcomer, emerging, and established tenure'
          description='Tenure is measured from each numeric GitHub developer’s first credited month.'
          option={tenure}
        />
        <ChartCard
          title='New developers and repositories'
          description='First credited developer appearances and organization-gated non-fork repositories.'
          option={growth}
        />
        <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
          <h2 className='text-2xl font-bold'>Classification coverage</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            GitHub-only organizations remain unclassified in overall analytics;
            out-of-scope entities stay in the corpus but not vertical
            comparisons.
          </p>
          <div className='mt-6 grid grid-cols-2 gap-4'>
            <Metric
              icon={Building2Icon}
              label='Organizations'
              value={`${report.coverage.organizationPercent.toFixed(1)}%`}
              detail={`${compact(report.coverage.categorizedOrganizations)} categorized · ${compact(report.coverage.unclassifiedOrganizations)} unclassified`}
            />
            <Metric
              icon={UsersRoundIcon}
              label='Developers'
              value={`${report.coverage.developerPercent.toFixed(1)}%`}
              detail={`${compact(report.coverage.categorizedDevelopers)} categorized · ${compact(report.coverage.unclassifiedDevelopers)} unclassified`}
            />
          </div>
        </section>
      </div>

      <OrganizationBubbleTimeline
        organizations={report.organizations}
        scopeLabel={report.scope.label}
        rangeLabel={report.range.label}
      />

      <section className='grid gap-6 lg:grid-cols-3'>
        <div className='rounded-2xl border border-border/60 bg-card/60 p-5'>
          <h2 className='text-xl font-bold'>Top verticals</h2>
          <div className='mt-4 space-y-2'>
            {report.top.verticals.map((vertical) => (
              <Link
                key={vertical.slug}
                href={reportHref(report, { vertical: vertical.slug })}
                className='flex items-center justify-between rounded-lg border border-border/50 px-3 py-2 hover:border-emerald-500/40'
              >
                <span>{vertical.label}</span>
                <strong>{compact(vertical.activeDevelopers)}</strong>
              </Link>
            ))}
          </div>
        </div>
        <div className='rounded-2xl border border-border/60 bg-card/60 p-5'>
          <h2 className='text-xl font-bold'>Top chains</h2>
          <div className='mt-4 space-y-2'>
            {report.top.chains.map((chain) => (
              <Link
                key={chain.slug}
                href={reportHref(report, { chain: chain.slug })}
                className='flex items-center justify-between rounded-lg border border-border/50 px-3 py-2 hover:border-sky-500/40'
              >
                <span>{chain.label}</span>
                <strong>{compact(chain.activeDevelopers)}</strong>
              </Link>
            ))}
          </div>
        </div>
        <div className='rounded-2xl border border-border/60 bg-card/60 p-5'>
          <h2 className='text-xl font-bold'>Top organizations</h2>
          <div className='mt-4 space-y-2'>
            {report.top.organizations.map((organization) => (
              <div
                key={organization.organizationKey}
                className='flex items-center justify-between rounded-lg border border-border/50 px-3 py-2'
              >
                <span>{organization.organizationName}</span>
                <strong>{compact(organization.activeDevelopers)}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className='flex flex-col gap-2 rounded-xl border border-border/50 bg-background/40 p-4 text-xs text-muted-foreground md:flex-row md:justify-between'>
        <span>
          Complete through {report.completeThrough} · {report.range.label}
        </span>
        <span className='inline-flex items-center gap-1'>
          <GitBranchIcon className='size-3' aria-hidden />
          Current scalar vertical applied retroactively; chains overlap.
        </span>
      </footer>
    </main>
  );
};
