'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import {
  ArrowRightIcon,
  Building2Icon,
  DatabaseIcon,
  FingerprintIcon,
  GitBranchIcon,
  GitCommitHorizontalIcon,
  NetworkIcon,
  ShieldCheckIcon,
  UserRoundCheckIcon,
  UsersRoundIcon,
} from 'lucide-react';

import { FlintEChart } from '@/features/job-market/components/flint-echart';
import { cn } from '@/lib/utils';
import type {
  DeveloperCohort,
  DeveloperReport,
  DeveloperReportRange,
} from '../schemas';
import {
  cadenceChartOption,
  chainBreadthChartOption,
  movementChartOption,
  newcomerChartOption,
  repositoryChartOption,
  tenureChartOption,
  workforceChartOption,
} from './chart-options';
import { OrganizationBubbleTimeline } from './organization-bubble-timeline';

const compact = (value: number) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

const cohortHref = (cohort: DeveloperCohort, range: DeveloperReportRange) => {
  const search = new URLSearchParams();
  if (cohort !== 'all') search.set('cohort', cohort);
  if (range !== 'all') search.set('range', range);
  return search.size ? `/developers?${search}` : '/developers';
};

const chainHref = (slug: string, range: DeveloperReportRange) =>
  range === 'all'
    ? `/developers/chains/${slug}`
    : `/developers/chains/${slug}?range=${range}`;

const rangeHref = (report: DeveloperReport, range: DeveloperReportRange) => {
  if (report.scope.type === 'chain' && report.scope.slug) {
    return chainHref(report.scope.slug, range);
  }
  return cohortHref(report.scope.key as DeveloperCohort, range);
};

const share = (part: number, total: number) =>
  total > 0 ? `${((part / total) * 100).toFixed(1)}%` : '—';

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
  ariaLabel,
}: {
  title: string;
  description: string;
  option: ReturnType<typeof workforceChartOption>;
  ariaLabel: string;
}) => (
  <div className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
    <h2 className='text-2xl font-bold'>{title}</h2>
    <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
    <FlintEChart
      option={option}
      className='mt-4 h-80 w-full'
      ariaLabel={ariaLabel}
    />
  </div>
);

const ScopeSelector = ({ report }: { report: DeveloperReport }) => (
  <section
    aria-label='Developer report scopes'
    className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'
  >
    <div className='flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between'>
      <div>
        <h2 className='text-2xl font-bold'>Compare sectors and chains</h2>
        <p className='mt-1 max-w-3xl text-sm text-muted-foreground'>
          Every card uses {report.range.label.toLowerCase()}. The population
          spread shows all contributors, verified internal people, and
          maintainers; chain reports overlap when people build across chains.
        </p>
      </div>
      <span className='text-xs text-muted-foreground'>
        {report.coverage.chainMappedGithubOrganizations.toLocaleString()} of{' '}
        {report.coverage.githubOrganizations.toLocaleString()} GitHub orgs
        chain-mapped ({report.coverage.chainMappedPercent.toFixed(1)}%)
      </span>
    </div>

    <div className='mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
      {report.scopes.cohorts.map((cohort) => (
        <Link
          key={cohort.cohort}
          href={cohortHref(cohort.cohort, report.range.key)}
          aria-current={
            report.scope.type === 'cohort' && cohort.cohort === report.scope.key
              ? 'page'
              : undefined
          }
          className={cn(
            'rounded-xl border p-4 transition-colors',
            report.scope.type === 'cohort' && cohort.cohort === report.scope.key
              ? 'border-emerald-500/60 bg-emerald-500/10'
              : 'border-border/60 bg-background/50 hover:border-emerald-500/35',
          )}
        >
          <span className='text-xs font-semibold tracking-wide text-muted-foreground uppercase'>
            {cohort.label}
          </span>
          <strong className='mt-2 block text-2xl'>
            {compact(cohort.contributors)}
          </strong>
          <span className='mt-1 block text-xs text-muted-foreground'>
            contributors · {compact(cohort.activePeople)} internal ·{' '}
            {compact(cohort.activeMaintainers)} maintainers
          </span>
        </Link>
      ))}
    </div>

    {report.scopes.chains.length > 0 && (
      <div className='mt-5 overflow-x-auto rounded-xl border border-border/60'>
        <table className='w-full min-w-[920px] text-left text-sm'>
          <thead className='bg-background/60 text-xs text-muted-foreground uppercase'>
            <tr>
              <th className='px-4 py-3'>Chain</th>
              <th className='px-4 py-3'>Contributors</th>
              <th className='px-4 py-3'>Internal people</th>
              <th className='px-4 py-3'>Maintainers</th>
              <th className='px-4 py-3'>Leads</th>
              <th className='px-4 py-3'>Organizations</th>
              <th className='px-4 py-3'>Repositories</th>
            </tr>
          </thead>
          <tbody>
            {report.scopes.chains.slice(0, 20).map((chain) => (
              <tr
                key={chain.chainSlug}
                className={cn(
                  'border-t border-border/50',
                  report.scope.type === 'chain' &&
                    report.scope.slug === chain.chainSlug &&
                    'bg-emerald-500/5',
                )}
              >
                <td className='px-4 py-3'>
                  <Link
                    href={chainHref(chain.chainSlug, report.range.key)}
                    className='font-semibold hover:text-emerald-400'
                  >
                    {chain.chainName}
                  </Link>
                </td>
                <td className='px-4 py-3'>{compact(chain.contributors)}</td>
                <td className='px-4 py-3'>{compact(chain.activePeople)}</td>
                <td className='px-4 py-3'>
                  {compact(chain.activeMaintainers)}
                </td>
                <td className='px-4 py-3'>{compact(chain.activeLeads)}</td>
                <td className='px-4 py-3'>
                  {compact(chain.activeOrganizations)}
                </td>
                <td className='px-4 py-3'>{compact(chain.repositoryCount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
);

export const DeveloperReportDashboard = ({
  report,
}: {
  report: DeveloperReport;
}) => {
  const history = report.history;
  const repositoryHistory = report.repositoryHistory;
  const workforce = useMemo(() => workforceChartOption(history), [history]);
  const cadence = useMemo(() => cadenceChartOption(history), [history]);
  const tenure = useMemo(() => tenureChartOption(history), [history]);
  const chainBreadth = useMemo(
    () => chainBreadthChartOption(history),
    [history],
  );
  const newcomers = useMemo(() => newcomerChartOption(history), [history]);
  const repositories = useMemo(
    () => repositoryChartOption(repositoryHistory),
    [repositoryHistory],
  );
  const movement = useMemo(() => movementChartOption(history), [history]);
  const current = report.current;
  if (!current) return null;

  const scopeLabel = report.scope.label;
  const organizations = [...report.organizations]
    .filter((organization) => organization.contributors > 0)
    .sort(
      (left, right) =>
        right.contributors - left.contributors ||
        left.organizationName.localeCompare(right.organizationName),
    )
    .slice(0, 30);
  const isChain = report.scope.type === 'chain';
  const isAll = report.scope.type === 'cohort' && report.scope.key === 'all';

  return (
    <div className='space-y-6 pb-16'>
      <section className='relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-card/60 px-5 py-8 md:px-8 md:py-10'>
        <div className='pointer-events-none absolute -top-32 right-0 size-96 rounded-full bg-emerald-500/10 blur-3xl' />
        <div className='relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between'>
          <div className='max-w-4xl'>
            <div className='flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-emerald-400 uppercase'>
              <GitCommitHorizontalIcon className='size-4' aria-hidden />
              {isChain
                ? 'Chain developer report'
                : isAll
                  ? 'Developer ecosystem report'
                  : 'Developer sector report'}
            </div>
            <h1 className='mt-3 text-4xl font-black tracking-tight md:text-6xl'>
              {isAll
                ? report.range.key === 'all'
                  ? 'The developer ecosystem since inception'
                  : `The developer ecosystem — ${report.range.label}`
                : `The people building ${scopeLabel}`}
            </h1>
            <p className='mt-4 max-w-3xl text-base text-muted-foreground md:text-lg'>
              All code contributors, verified internal employees, maintainers,
              active leads, repositories, organizations, and team movement from
              the same recorded GitHub history.
            </p>
            <p className='mt-4 text-xs text-muted-foreground'>
              {report.range.label}: {report.range.from} through{' '}
              {report.range.to}
              {' · '}complete through {report.completeThrough ?? report.asOf}
            </p>
            {isChain && (
              <p className='mt-2 text-xs text-amber-300/80'>
                Chain cohorts overlap: a person active across several chains is
                counted in each relevant chain report, but only once in sector
                totals.
              </p>
            )}
          </div>
          <div className='flex flex-col items-start gap-3 lg:items-end'>
            <div
              className='flex rounded-lg border border-border/60 bg-background/70 p-1'
              aria-label='Report time range'
            >
              {(
                [
                  ['all', 'Since inception'],
                  ['3y', '3 years'],
                  ['1y', '1 year'],
                ] as const
              ).map(([value, label]) => (
                <Link
                  key={value}
                  href={rangeHref(report, value)}
                  aria-current={report.range.key === value ? 'page' : undefined}
                  className={cn(
                    'rounded-md px-3 py-2 text-xs font-bold',
                    report.range.key === value
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className='flex flex-wrap gap-3'>
              {isChain && (
                <Link
                  href={cohortHref('all', report.range.key)}
                  className='inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-bold'
                >
                  All developers
                </Link>
              )}
              <a
                href='https://ecosystem.vision/people'
                className='inline-flex w-fit items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-bold text-background'
              >
                Explore people
                <ArrowRightIcon className='size-4' aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </section>

      <ScopeSelector report={report} />

      <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
        <div className='mb-4'>
          <h2 className='text-2xl font-bold'>{scopeLabel} at a glance</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            Distinct populations and recorded work across{' '}
            {report.range.label.toLowerCase()}. Every value below uses the same
            interval as the rest of this report.
          </p>
        </div>
        <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
          <Metric
            icon={UsersRoundIcon}
            label='All contributors'
            value={compact(report.summary.contributors)}
            detail='Any human commit author in this scope'
          />
          <Metric
            icon={UserRoundCheckIcon}
            label='Verified internal people'
            value={compact(report.summary.internalPeople)}
            detail={`${share(report.summary.internalPeople, report.summary.contributors)} of contributors`}
          />
          <Metric
            icon={ShieldCheckIcon}
            label='Maintainers'
            value={compact(report.summary.maintainers)}
            detail={`${share(report.summary.maintainers, report.summary.internalPeople)} of internal people`}
          />
          <Metric
            icon={Building2Icon}
            label='Organizations'
            value={compact(report.summary.organizations)}
            detail='With contributor activity in this interval'
          />
          <Metric
            icon={GitBranchIcon}
            label='Repositories created'
            value={compact(report.summary.repositoryCount)}
            detail='Original non-fork repositories in this interval'
          />
          <Metric
            icon={DatabaseIcon}
            label='Contributor commit records'
            value={compact(report.summary.indexedCommitRecords)}
            detail='All human contributor activity in this scope'
          />
          <Metric
            icon={GitCommitHorizontalIcon}
            label='Internal commit records'
            value={compact(report.summary.internalCommitRecords)}
            detail='Commit activity attributed to internal people'
          />
          <Metric
            icon={UserRoundCheckIcon}
            label='Active leads'
            value={compact(report.summary.activeLeads)}
            detail='Internal maintainers with recent merge authority'
          />
        </div>
      </section>

      {isAll && report.range.key === 'all' && (
        <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
          <h2 className='text-2xl font-bold'>Corpus coverage</h2>
          <p className='mt-1 max-w-5xl text-sm text-muted-foreground'>
            All retained, non-banned GitHub records behind the since-inception
            report. Distinct people are shown in the population cards above;
            these figures describe the underlying record set.
          </p>
          <div className='mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
            <Metric
              icon={DatabaseIcon}
              label='Commit records'
              value={compact(report.corpus.indexedCommitRecords)}
              detail='Unique owner / repository / SHA rows'
            />
            <Metric
              icon={FingerprintIcon}
              label='Distinct commit SHAs'
              value={compact(report.corpus.distinctCommitShas)}
              detail='Deduplicated across repositories and forks'
            />
            <Metric
              icon={GitBranchIcon}
              label='Indexed repositories'
              value={compact(report.corpus.indexedRepositories)}
              detail='Repositories retained for analysis'
            />
            <Metric
              icon={NetworkIcon}
              label='GitHub organizations'
              value={compact(report.corpus.indexedGithubOrganizations)}
              detail='Non-banned indexed owners'
            />
          </div>
        </section>
      )}

      <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
        <h2 className='text-2xl font-bold'>Contributor population layers</h2>
        <p className='mt-1 max-w-4xl text-sm text-muted-foreground'>
          All human commit authors form the outer population. Internal people
          are the verified subset with repeated organizational write authority;
          maintainers and active leads are progressively narrower subsets.
        </p>
        <FlintEChart
          option={workforce}
          className='mt-5 h-96 w-full'
          ariaLabel='Monthly all contributors, verified internal people, maintainers, and active leads'
        />
      </section>

      <section className='grid gap-4 xl:grid-cols-2'>
        <ChartCard
          title='Contribution cadence'
          description='Internal people grouped by distinct active days in each month. Cadence measures consistency, not title or seniority.'
          option={cadence}
          ariaLabel='Internal people by one-day, regular, and sustained monthly contribution cadence'
        />
        <ChartCard
          title='Developer tenure'
          description='Time since a person’s first verified internal month: newcomers under 3 months, emerging at 3–23 months, established at 24 months or more.'
          option={tenure}
          ariaLabel='Internal people by newcomer, emerging, and established tenure'
        />
      </section>

      <section className='grid gap-4 xl:grid-cols-2'>
        <ChartCard
          title='Chain breadth'
          description='The number of internal people attached to one chain, several chains, or organizations not yet mapped to a chain.'
          option={chainBreadth}
          ariaLabel='Internal people by single-chain, multi-chain, and unmapped chain breadth'
        />
        <ChartCard
          title='Joining, exiting, and moving'
          description='Confirmed changes in primary organization. Movement is separate from people entering or leaving the measured scope.'
          option={movement}
          ariaLabel='Monthly joins, exits, and movements between organizations'
        />
      </section>

      <section className='grid gap-4 xl:grid-cols-2'>
        <ChartCard
          title='Newcomer activity'
          description='Active internal people whose first verified internal month was less than three months earlier.'
          option={newcomers}
          ariaLabel='Monthly active newcomer internal people'
        />
        <ChartCard
          title='New repositories'
          description='Original, non-fork repositories created by organizations in this report scope.'
          option={repositories}
          ariaLabel='New non-fork repositories created each month'
        />
      </section>

      <OrganizationBubbleTimeline
        organizations={report.organizations}
        scopeLabel={scopeLabel}
        rangeLabel={report.range.label}
      />

      <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
        <div className='flex flex-col gap-2 md:flex-row md:items-end md:justify-between'>
          <div>
            <h2 className='text-2xl font-bold'>
              {isAll
                ? 'Organization populations'
                : `${scopeLabel} organization populations`}
            </h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              Ranked by distinct contributors across{' '}
              {report.range.label.toLowerCase()}. Every nested population and
              work total uses that same interval.
            </p>
          </div>
          <a
            href='https://ecosystem.vision/organizations'
            className='text-sm font-semibold text-emerald-400 hover:underline'
          >
            Explore all organizations
          </a>
        </div>
        <div className='mt-5 overflow-x-auto rounded-xl border border-border/60'>
          <table className='w-full min-w-[1120px] text-left text-sm'>
            <thead className='bg-background/60 text-xs text-muted-foreground uppercase'>
              <tr>
                <th className='px-4 py-3'>Organization</th>
                <th className='px-4 py-3'>Contributors</th>
                <th className='px-4 py-3'>Internal</th>
                <th className='px-4 py-3'>Maintainers</th>
                <th className='px-4 py-3'>Leads</th>
                <th className='px-4 py-3'>Internal share</th>
                <th className='px-4 py-3'>Joined / exited</th>
                <th className='px-4 py-3'>Internal commits</th>
                <th className='px-4 py-3'>Merged PRs</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((organization) => (
                <tr
                  key={organization.organizationKey}
                  className='border-t border-border/50'
                >
                  <td className='px-4 py-3'>
                    <Link
                      href={`https://ecosystem.vision/organizations/info/${organization.organizationSlug}`}
                      className='font-semibold hover:text-emerald-400'
                    >
                      {organization.organizationName}
                    </Link>
                  </td>
                  <td className='px-4 py-3'>
                    {compact(organization.contributors)}
                  </td>
                  <td className='px-4 py-3'>
                    {compact(organization.internalPeople)}
                  </td>
                  <td className='px-4 py-3'>
                    {compact(organization.maintainers)}
                  </td>
                  <td className='px-4 py-3'>{compact(organization.leads)}</td>
                  <td className='px-4 py-3'>
                    {share(
                      organization.internalPeople,
                      organization.contributors,
                    )}
                  </td>
                  <td className='px-4 py-3'>
                    <span className='text-emerald-400'>
                      +{organization.joins}
                    </span>
                    {' / '}
                    <span className='text-rose-400'>−{organization.exits}</span>
                  </td>
                  <td className='px-4 py-3'>
                    {compact(organization.commitCount)}
                  </td>
                  <td className='px-4 py-3'>
                    {compact(organization.mergeCount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {report.movements.length > 0 && (
        <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
          <div className='flex items-center gap-2'>
            <NetworkIcon className='size-5 text-emerald-400' aria-hidden />
            <h2 className='text-2xl font-bold'>Largest observed team flows</h2>
          </div>
          <p className='mt-1 text-sm text-muted-foreground'>
            Top organization-to-organization moves across{' '}
            {report.range.label.toLowerCase()}, inferred from confirmed changes
            in primary internal affiliation rather than profile claims.
          </p>
          <div className='mt-5 grid gap-3 md:grid-cols-2'>
            {report.movements.slice(0, 12).map((flow) => (
              <div
                key={`${flow.sourceOrganizationKey}:${flow.destinationOrganizationKey}`}
                className='flex items-center gap-3 rounded-xl border border-border/60 bg-background/50 p-4'
              >
                <span className='min-w-0 flex-1 truncate font-semibold'>
                  {flow.sourceOrganizationName}
                </span>
                <ArrowRightIcon
                  className='size-4 shrink-0 text-muted-foreground'
                  aria-hidden
                />
                <span className='min-w-0 flex-1 truncate font-semibold'>
                  {flow.destinationOrganizationName}
                </span>
                <span className='rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-bold text-emerald-400'>
                  {flow.people}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className='rounded-xl border border-border/60 bg-background/45 p-4 text-xs text-muted-foreground'>
        <div className='flex items-start gap-3'>
          <ShieldCheckIcon
            className='mt-0.5 size-4 shrink-0 text-emerald-400'
            aria-hidden
          />
          <p>
            <strong className='text-foreground'>Population and limits.</strong>{' '}
            {report.population.definition} The verified-internal layer excludes{' '}
            {report.population.excludes.join(', ')}, while the outer contributor
            layer includes human external commit authors. Activity cadence
            counts distinct active days; tenure starts with the first observed
            internal month. Repositories exclude forks. GitHub cannot observe
            private work, so every count is a lower bound.{' '}
            {report.coverage.note}
          </p>
        </div>
      </section>
    </div>
  );
};
