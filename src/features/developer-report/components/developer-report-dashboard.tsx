'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import {
  Building2Icon,
  CopyIcon,
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
  codeFlowChartOption,
  newDevelopersChartOption,
  repositoryGrowthChartOption,
  tenureChartOption,
  workforceChartOption,
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
        <h2 className='text-2xl font-bold'>Explore by category or chain</h2>
        <p className='mt-1 max-w-3xl text-sm text-muted-foreground'>
          Each organization belongs to one category, but it can build on more
          than one chain. Choose a category, a chain, or both to update every
          chart.
        </p>
      </div>
      <span className='text-xs text-muted-foreground'>
        {report.coverage.organizationPercent.toFixed(1)}% of organizations ·{' '}
        {report.coverage.developerPercent.toFixed(1)}% of developers categorized
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
            {compact(vertical.internalDevelopers)} team developers ·{' '}
            {compact(vertical.activeOrganizations)} organizations
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
  const newDevelopers = useMemo(
    () => newDevelopersChartOption(report.history),
    [report.history],
  );
  const repositoryGrowth = useMemo(
    () => repositoryGrowthChartOption(report.history),
    [report.history],
  );
  const codeFlow = useMemo(
    () => codeFlowChartOption(report.history),
    [report.history],
  );
  const inheritedCommits =
    report.summary.inheritedForkCommits +
    report.summary.inheritedUnattributedCopyCommits;

  return (
    <main className='mx-auto w-full max-w-[1600px] space-y-6 px-4 py-8 md:px-8'>
      <header className='overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-6 md:p-9'>
        <p className='text-xs font-semibold tracking-[0.2em] text-emerald-400 uppercase'>
          Open-source developer report
        </p>
        <div className='mt-3 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between'>
          <div>
            <h1 className='text-4xl font-black tracking-tight md:text-6xl'>
              {report.scope.label}
            </h1>
            <p className='mt-3 max-w-4xl text-sm text-muted-foreground md:text-base'>
              Developers are counted when a new commit is attributed to them in
              an included public GitHub repository. Older history brought into a
              repository through a fork or an unattributed copy is measured
              separately, while bots and banned organizations are excluded.
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

        <div className='mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          <Metric
            icon={DatabaseIcon}
            label='Commits scanned'
            value={compact(report.summary.rawIndexedCommitRecords)}
            detail='Commit records considered before attribution'
          />
          <Metric
            icon={GitCommitHorizontalIcon}
            label='Commits written'
            value={compact(report.summary.commitsWritten)}
            detail='New commits attributed to their source repository'
          />
          <Metric
            icon={CopyIcon}
            label='Inherited commits'
            value={compact(inheritedCommits)}
            detail='Older history found in forks and unattributed copies'
          />
          <Metric
            icon={GitBranchIcon}
            label='Forks · unattributed copies'
            value={`${compact(report.summary.newForkRepositories)} · ${compact(report.summary.newUnattributedCopyRepositories)}`}
            detail='Destination repositories created in this period'
          />
          <Metric
            icon={UsersRoundIcon}
            label='Contributors found'
            value={compact(report.summary.allContributors)}
            detail='Unique GitHub developers seen before filtering'
          />
          <Metric
            icon={UserRoundCheckIcon}
            label='Active developers'
            value={compact(report.summary.activeDevelopers)}
            detail='Developers who authored original code'
          />
          <Metric
            icon={ShieldCheckIcon}
            label='Team developers'
            value={compact(report.summary.internalDevelopers)}
            detail={`${(report.summary.internalDeveloperShare * 100).toFixed(1)}% of active developers`}
          />
          <Metric
            icon={Building2Icon}
            label='Maintainers · team leads'
            value={`${compact(report.summary.maintainers)} · ${compact(report.summary.activeLeads)}`}
            detail={`${compact(report.summary.organizations)} organizations`}
          />
        </div>
      </header>

      <ScopeSelector report={report} />

      <div className='grid gap-6 xl:grid-cols-2'>
        <ChartCard
          title='Active developers over time'
          description='The gray line shows everyone found in scanned commits. The colored lines show developers with newly written commits that month, including team developers, maintainers, and leads.'
          option={workforce}
        />
        <ChartCard
          title='Code written and inherited each month'
          description='The green line is new commits written that month. The bars are older commits found inside forked or copied repositories created that month. Each month stands alone; nothing accumulates from earlier months.'
          option={codeFlow}
        />
        <ChartCard
          title='Active developers by contribution frequency'
          description='Full-time developers contributed on 10 or more days that month, part-time developers on 2–9 days, and one-time developers on 1 day.'
          option={cadence}
        />
        <ChartCard
          title='Active developers by tenure'
          description='Newcomers started contributing less than 3 months ago, emerging developers 3 months to 2 years ago, and established developers 2 or more years ago.'
          option={tenure}
        />
        <ChartCard
          title='New developers'
          description='A developer is counted once, in the month of their first newly written commit in the report.'
          option={newDevelopers}
        />
        <ChartCard
          title='New repositories by how code arrived'
          description='Repositories built from scratch, GitHub forks, and unattributed copies are counted in the destination repository’s creation month. An unattributed copy has no GitHub fork relationship, but its early commit hashes match an older repository owned elsewhere—the same signal used in threat intelligence.'
          option={repositoryGrowth}
        />
        <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6 xl:col-span-2'>
          <h2 className='text-2xl font-bold'>
            How much of the dataset is categorized
          </h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            Organizations known only from GitHub may not have a category yet.
            They still appear in overall totals, but not in comparisons between
            categories.
          </p>
          <div className='mt-6 grid grid-cols-2 gap-4'>
            <Metric
              icon={Building2Icon}
              label='Organizations'
              value={`${report.coverage.organizationPercent.toFixed(1)}%`}
              detail={`${compact(report.coverage.categorizedOrganizations)} categorized · ${compact(report.coverage.unclassifiedOrganizations)} not yet categorized`}
            />
            <Metric
              icon={UsersRoundIcon}
              label='Developers'
              value={`${report.coverage.developerPercent.toFixed(1)}%`}
              detail={`${compact(report.coverage.categorizedDevelopers)} categorized · ${compact(report.coverage.unclassifiedDevelopers)} not yet categorized`}
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
          <h2 className='text-xl font-bold'>Largest categories</h2>
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
          <h2 className='text-xl font-bold'>Most active chains</h2>
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
          <h2 className='text-xl font-bold'>Most active organizations</h2>
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
          Each organization’s current category is used for all dates.
          Organizations may appear under more than one chain.
        </span>
      </footer>
    </main>
  );
};
