'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowRightIcon,
  Building2Icon,
  GitBranchIcon,
  GitCommitHorizontalIcon,
  GitMergeIcon,
  NetworkIcon,
  ShieldCheckIcon,
  UserRoundCheckIcon,
  UsersRoundIcon,
} from 'lucide-react';

import { FlintEChart } from '@/features/job-market/components/flint-echart';
import { cn } from '@/lib/utils';
import type { DeveloperCohort, DeveloperReport } from '../schemas';
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

type Range = '1y' | '3y' | 'all';

const compact = (value: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value);

const cohortHref = (cohort: DeveloperCohort) =>
  cohort === 'all' ? '/developers' : `/developers?cohort=${cohort}`;

const rangeLength: Record<Range, number | null> = {
  '1y': 12,
  '3y': 36,
  all: null,
};

const clipped = <T,>(values: T[], range: Range) => {
  const length = rangeLength[range];
  return length === null ? values : values.slice(-length);
};

const growth = (value: number | null) =>
  value === null ? '—' : `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

const Growth = ({ value }: { value: number | null }) => (
  <span
    className={cn(
      'font-semibold tabular-nums',
      value !== null && value > 0 && 'text-emerald-400',
      value !== null && value < 0 && 'text-rose-400',
      value === null && 'text-muted-foreground',
    )}
    title={
      value === null
        ? 'Not published: current or baseline cohort is below 10 people'
        : undefined
    }
  >
    {growth(value)}
  </span>
);

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
          Sector totals assign each organization once. Chain reports overlap by
          design because the same internal person can build across more than one
          chain.
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
          href={cohortHref(cohort.cohort)}
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
            {compact(cohort.activePeople)}
          </strong>
          <span className='mt-1 block text-xs text-muted-foreground'>
            internal people · {compact(cohort.activeOrganizations)} orgs
          </span>
        </Link>
      ))}
    </div>

    {report.scopes.chains.length > 0 && (
      <div className='mt-5 overflow-x-auto rounded-xl border border-border/60'>
        <table className='w-full min-w-[860px] text-left text-sm'>
          <thead className='bg-background/60 text-xs text-muted-foreground uppercase'>
            <tr>
              <th className='px-4 py-3'>Chain</th>
              <th className='px-4 py-3'>Internal people</th>
              <th className='px-4 py-3'>Established</th>
              <th className='px-4 py-3'>Maintainers</th>
              <th className='px-4 py-3'>Organizations</th>
              <th className='px-4 py-3'>Repositories</th>
              <th className='px-4 py-3'>1 year</th>
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
                    href={`/developers/chains/${chain.chainSlug}`}
                    className='font-semibold hover:text-emerald-400'
                  >
                    {chain.chainName}
                  </Link>
                </td>
                <td className='px-4 py-3'>{compact(chain.activePeople)}</td>
                <td className='px-4 py-3'>
                  {compact(chain.establishedPeople)}
                </td>
                <td className='px-4 py-3'>
                  {compact(chain.activeMaintainers)}
                </td>
                <td className='px-4 py-3'>
                  {compact(chain.activeOrganizations)}
                </td>
                <td className='px-4 py-3'>{compact(chain.repositoryCount)}</td>
                <td className='px-4 py-3'>
                  <Growth value={chain.growth.oneYear} />
                </td>
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
  const [range, setRange] = useState<Range>('3y');
  const history = useMemo(
    () => clipped(report.history, range),
    [range, report.history],
  );
  const repositoryHistory = useMemo(
    () => clipped(report.repositoryHistory, range),
    [range, report.repositoryHistory],
  );
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
    .filter((organization) => organization.activePeople > 0)
    .sort(
      (left, right) =>
        right.activePeople - left.activePeople ||
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
                  ? 'Internal developer report'
                  : 'Developer sector report'}
            </div>
            <h1 className='mt-3 text-4xl font-black tracking-tight md:text-6xl'>
              {isAll
                ? 'The internal developer ecosystem'
                : `The people building ${scopeLabel}`}
            </h1>
            <p className='mt-4 max-w-3xl text-base text-muted-foreground md:text-lg'>
              Verified internal employees, maintainers, active leads,
              contribution cadence, tenure, repository creation, organization
              growth, and team movement from recorded GitHub work history.
            </p>
            <p className='mt-4 text-xs text-muted-foreground'>
              Complete through {report.completeThrough ?? report.asOf} ·{' '}
              {report.population.definition}
            </p>
            {isChain && (
              <p className='mt-2 text-xs text-amber-300/80'>
                Chain cohorts overlap: a person active across several chains is
                counted in each relevant chain report, but only once in sector
                totals.
              </p>
            )}
          </div>
          <div className='flex flex-wrap gap-3'>
            {isChain && (
              <Link
                href='/developers'
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
      </section>

      <ScopeSelector report={report} />

      <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
        <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h2 className='text-2xl font-bold'>{scopeLabel} at a glance</h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              Latest complete month, with historical totals clearly labeled.
            </p>
          </div>
          <div
            className='flex w-fit rounded-lg border border-border/60 bg-background/70 p-1'
            aria-label='Chart time range'
          >
            {(['1y', '3y', 'all'] as const).map((value) => (
              <button
                key={value}
                type='button'
                onClick={() => setRange(value)}
                aria-pressed={range === value}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-bold uppercase',
                  range === value
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-6'>
          <Metric
            icon={UsersRoundIcon}
            label='Internal people'
            value={compact(current.activePeople)}
            detail='Active in the complete month'
          />
          <Metric
            icon={GitMergeIcon}
            label='Maintainers'
            value={compact(current.activeMaintainers)}
            detail='Internal people who merge PRs'
          />
          <Metric
            icon={UserRoundCheckIcon}
            label='Active leads'
            value={compact(current.activeLeads)}
            detail='Recent merge authority'
          />
          <Metric
            icon={Building2Icon}
            label='Organizations'
            value={compact(current.activeOrganizations)}
            detail='With verified internal activity'
          />
          <Metric
            icon={GitBranchIcon}
            label='Non-fork repositories'
            value={compact(report.totals.repositoryCount)}
            detail='Created through the complete month'
          />
          <Metric
            icon={GitCommitHorizontalIcon}
            label='Recorded commits'
            value={compact(report.totals.commitCount)}
            detail='Across published report history'
          />
        </div>
      </section>

      <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
        <h2 className='text-2xl font-bold'>Internal developer population</h2>
        <p className='mt-1 max-w-4xl text-sm text-muted-foreground'>
          People are counted once in their primary organization per month.
          Maintainers merge pull requests; active leads have recent merge
          authority. External drive-by contributors do not enter this report.
        </p>
        <FlintEChart
          option={workforce}
          className='mt-5 h-96 w-full'
          ariaLabel='Monthly verified internal people, maintainers, and active leads'
        />
      </section>

      <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
        <h2 className='text-2xl font-bold'>Comparable developer signals</h2>
        <p className='mt-1 text-sm text-muted-foreground'>
          Current headcount and change from the matching complete month. Growth
          is withheld when either side contains fewer than ten people.
        </p>
        <div className='mt-5 overflow-x-auto rounded-xl border border-border/60'>
          <table className='w-full min-w-[640px] text-left text-sm'>
            <thead className='bg-background/60 text-xs text-muted-foreground uppercase'>
              <tr>
                <th className='px-4 py-3'>Measure</th>
                <th className='px-4 py-3'>Current</th>
                <th className='px-4 py-3'>1 year</th>
                <th className='px-4 py-3'>2 years</th>
                <th className='px-4 py-3'>3 years</th>
              </tr>
            </thead>
            <tbody>
              {report.breakdown.map((row) => (
                <tr key={row.key} className='border-t border-border/50'>
                  <td className='px-4 py-3 font-semibold'>{row.label}</td>
                  <td className='px-4 py-3'>{compact(row.current)}</td>
                  <td className='px-4 py-3'>
                    <Growth value={row.growth.oneYear} />
                  </td>
                  <td className='px-4 py-3'>
                    <Growth value={row.growth.twoYear} />
                  </td>
                  <td className='px-4 py-3'>
                    <Growth value={row.growth.threeYear} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
        range={range}
        scopeLabel={scopeLabel}
      />

      <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
        <div className='flex flex-col gap-2 md:flex-row md:items-end md:justify-between'>
          <div>
            <h2 className='text-2xl font-bold'>
              {isAll
                ? 'Organizations building now'
                : `${scopeLabel} organizations building now`}
            </h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              Ranked by current verified internal people. Established people and
              one-, two-, and three-year comparisons make team depth and
              direction visible.
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
          <table className='w-full min-w-[1080px] text-left text-sm'>
            <thead className='bg-background/60 text-xs text-muted-foreground uppercase'>
              <tr>
                <th className='px-4 py-3'>Organization</th>
                <th className='px-4 py-3'>Internal</th>
                <th className='px-4 py-3'>Established</th>
                <th className='px-4 py-3'>Maintainers</th>
                <th className='px-4 py-3'>Leads</th>
                <th className='px-4 py-3'>1 year</th>
                <th className='px-4 py-3'>2 years</th>
                <th className='px-4 py-3'>3 years</th>
                <th className='px-4 py-3'>Joined / exited</th>
                <th className='px-4 py-3'>12m commits</th>
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
                    {compact(organization.activePeople)}
                  </td>
                  <td className='px-4 py-3'>
                    {compact(organization.establishedPeople)}
                  </td>
                  <td className='px-4 py-3'>
                    {compact(organization.activeMaintainers)}
                  </td>
                  <td className='px-4 py-3'>
                    {compact(organization.activeLeads)}
                  </td>
                  <td className='px-4 py-3'>
                    <Growth value={organization.growth.oneYear} />
                  </td>
                  <td className='px-4 py-3'>
                    <Growth value={organization.growth.twoYear} />
                  </td>
                  <td className='px-4 py-3'>
                    <Growth value={organization.growth.threeYear} />
                  </td>
                  <td className='px-4 py-3'>
                    <span className='text-emerald-400'>
                      +{organization.joins12m}
                    </span>
                    {' / '}
                    <span className='text-rose-400'>
                      −{organization.exits12m}
                    </span>
                  </td>
                  <td className='px-4 py-3'>
                    {compact(organization.commitCount12m)}
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
            Top organization-to-organization moves in the trailing twelve
            months, inferred from confirmed changes in primary internal
            affiliation rather than profile claims.
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
            {report.population.definition} This report excludes{' '}
            {report.population.excludes.join(', ')}. Activity cadence counts
            distinct active days; tenure starts with the first observed internal
            month. Repositories exclude forks. GitHub cannot observe private
            work, so every count is a lower bound. {report.coverage.note}
          </p>
        </div>
      </section>
    </div>
  );
};
