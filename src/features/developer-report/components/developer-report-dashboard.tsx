'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import {
  ArrowRightIcon,
  Building2Icon,
  GitCommitHorizontalIcon,
  GitMergeIcon,
  ShieldCheckIcon,
  UserRoundCheckIcon,
  UsersRoundIcon,
} from 'lucide-react';

import { FlintEChart } from '@/features/job-market/components/flint-echart';
import { cn } from '@/lib/utils';
import type { DeveloperReport } from '../schemas';
import {
  movementChartOption,
  participationChartOption,
  workforceChartOption,
} from './chart-options';

const compact = (value: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value);

const percent = (value: number) => `${(value * 100).toFixed(0)}%`;

const signed = (value: number) => `${value > 0 ? '+' : ''}${value}`;

const month = (value: string) => {
  const parsed = new Date(`${value.slice(0, 7)}-01T00:00:00Z`);
  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      });
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

const RetentionCell = ({ value }: { value: number }) => (
  <div className='relative h-8 min-w-20 overflow-hidden rounded-md bg-background'>
    <div
      className='absolute inset-y-0 left-0 bg-emerald-500/25'
      style={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }}
    />
    <span className='relative flex h-full items-center px-2 text-xs font-semibold'>
      {percent(value)}
    </span>
  </div>
);

export const DeveloperReportDashboard = ({
  report,
}: {
  report: DeveloperReport;
}) => {
  const history = report.history.slice(-72);
  const workforce = useMemo(() => workforceChartOption(history), [history]);
  const participation = useMemo(
    () => participationChartOption(history),
    [history],
  );
  const movement = useMemo(() => movementChartOption(history), [history]);
  const current = report.current;
  if (!current) return null;

  const netChange = current.joins - current.exits;
  const retention = report.retention.slice(-18).reverse();
  const organizations = report.organizations.slice(0, 30);
  const activePeople12mAgo = report.history.at(-13)?.activePeople ?? null;
  const peopleChange =
    activePeople12mAgo && activePeople12mAgo > 0
      ? ((current.activePeople - activePeople12mAgo) / activePeople12mAgo) * 100
      : null;

  return (
    <div className='space-y-6 pb-16'>
      <section className='relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-card/60 px-5 py-8 md:px-8 md:py-10'>
        <div className='pointer-events-none absolute -top-32 right-0 size-96 rounded-full bg-emerald-500/10 blur-3xl' />
        <div className='relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between'>
          <div className='max-w-4xl'>
            <div className='flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-emerald-400 uppercase'>
              <GitCommitHorizontalIcon className='size-4' aria-hidden />
              Crypto developer report
            </div>
            <h1 className='mt-3 text-4xl font-black tracking-tight md:text-6xl'>
              The people maintaining crypto
            </h1>
            <p className='mt-4 max-w-3xl text-base text-muted-foreground md:text-lg'>
              A monthly view of verified internal employees, maintainers, lead
              developers, team growth, retention, and movement across the
              ecosystem—derived from recorded GitHub work history.
            </p>
            <p className='mt-4 text-xs text-muted-foreground'>
              Complete through {report.completeThrough ?? report.asOf} ·{' '}
              {report.population.definition}
            </p>
          </div>
          <Link
            href='https://ecosystem.vision/people'
            className='inline-flex w-fit items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-bold text-background'
          >
            Explore people on Ecosystem Vision
            <ArrowRightIcon className='size-4' aria-hidden />
          </Link>
        </div>
      </section>

      <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
        <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-5'>
          <Metric
            icon={UsersRoundIcon}
            label='Active internal people'
            value={compact(current.activePeople)}
            detail={
              peopleChange === null
                ? 'Current complete month'
                : `${peopleChange > 0 ? '+' : ''}${peopleChange.toFixed(1)}% over 12 months`
            }
          />
          <Metric
            icon={GitMergeIcon}
            label='Maintainers'
            value={compact(current.activeMaintainers)}
            detail='Internal people who merge pull requests'
          />
          <Metric
            icon={UserRoundCheckIcon}
            label='Active leads'
            value={compact(current.activeLeads)}
            detail='Active now with a merge in the trailing three months'
          />
          <Metric
            icon={Building2Icon}
            label='Active organizations'
            value={compact(current.activeOrganizations)}
            detail='Organizations with verified internal activity'
          />
          <Metric
            icon={ShieldCheckIcon}
            label='Net team change'
            value={signed(netChange)}
            detail={`${compact(current.joins)} joined · ${compact(current.exits)} exited`}
          />
        </div>
      </section>

      <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
        <h2 className='text-2xl font-bold'>Internal developer population</h2>
        <p className='mt-1 max-w-4xl text-sm text-muted-foreground'>
          People are counted once in their primary organization for a month.
          Maintainers are the internal employees who merge pull requests; active
          leads are active now and merged in the current or preceding two
          months.
        </p>
        <FlintEChart
          option={workforce}
          className='mt-5 h-96 w-full'
          ariaLabel='Monthly verified internal people, maintainers, and active leads'
        />
      </section>

      <section className='grid gap-4 xl:grid-cols-2'>
        <div className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
          <h2 className='text-2xl font-bold'>Depth of participation</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            Monthly internal people grouped by the number of distinct days on
            which recorded work occurred. This is activity depth, not seniority.
          </p>
          <FlintEChart
            option={participation}
            className='mt-4 h-80 w-full'
            ariaLabel='Internal people by one-day, regular, and sustained monthly activity'
          />
        </div>
        <div className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
          <h2 className='text-2xl font-bold'>Joining, exiting, and moving</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            Confirmed changes in primary organization. Movement is shown
            separately from people entering or leaving the measured ecosystem.
          </p>
          <FlintEChart
            option={movement}
            className='mt-4 h-80 w-full'
            ariaLabel='Monthly joins, exits, and movements between organizations'
          />
        </div>
      </section>

      <section className='grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,.6fr)]'>
        <div className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
          <h2 className='text-2xl font-bold'>Retention by starting cohort</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            The share of internal people still active 3, 6, and 12 months after
            their first observed internal month. Cohorts below 20 people are not
            published.
          </p>
          <div className='mt-5 overflow-x-auto'>
            <table className='w-full min-w-[560px] text-left text-sm'>
              <thead className='text-xs text-muted-foreground uppercase'>
                <tr>
                  <th className='pb-3'>Started</th>
                  <th className='pb-3'>People</th>
                  <th className='pb-3'>Month 3</th>
                  <th className='pb-3'>Month 6</th>
                  <th className='pb-3'>Month 12</th>
                </tr>
              </thead>
              <tbody>
                {retention.map((cohort) => (
                  <tr
                    key={cohort.cohortMonth}
                    className='border-t border-border/50'
                  >
                    <td className='py-2.5 font-semibold'>
                      {month(cohort.cohortMonth)}
                    </td>
                    <td className='py-2.5'>{compact(cohort.cohortSize)}</td>
                    <td className='py-2.5'>
                      <RetentionCell value={cohort.retainedMonth3} />
                    </td>
                    <td className='py-2.5'>
                      <RetentionCell value={cohort.retainedMonth6} />
                    </td>
                    <td className='py-2.5'>
                      <RetentionCell value={cohort.retainedMonth12} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
          <h2 className='text-2xl font-bold'>Maintainer leverage</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            How many distinct internal authors a maintainer merged code for in
            the complete month—not a claim about title or seniority.
          </p>
          <strong className='mt-8 block text-5xl tracking-tight'>
            {report.maintainerLeverage.medianAuthorsSupported ?? '—'}
          </strong>
          <p className='mt-1 text-sm text-muted-foreground'>
            median internal authors supported
          </p>
          <div className='mt-6 grid grid-cols-2 gap-3'>
            <div className='rounded-lg bg-background/60 p-3'>
              <span className='text-xs text-muted-foreground'>Middle 50%</span>
              <strong className='mt-1 block'>
                {report.maintainerLeverage.p25AuthorsSupported ?? '—'}–
                {report.maintainerLeverage.p75AuthorsSupported ?? '—'}
              </strong>
            </div>
            <div className='rounded-lg bg-background/60 p-3'>
              <span className='text-xs text-muted-foreground'>Merged PRs</span>
              <strong className='mt-1 block'>
                {compact(report.maintainerLeverage.mergedPrCount)}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className='rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
        <div className='flex flex-col gap-2 md:flex-row md:items-end md:justify-between'>
          <div>
            <h2 className='text-2xl font-bold'>Organizations building now</h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              Ranked by verified internal people in the latest complete month.
              Twelve-month change, joins, and exits make growth interpretable.
            </p>
          </div>
          <Link
            href='https://ecosystem.vision/organizations'
            className='text-sm font-semibold text-emerald-400 hover:underline'
          >
            Explore all organizations
          </Link>
        </div>
        <div className='mt-5 overflow-x-auto rounded-xl border border-border/60'>
          <table className='w-full min-w-[900px] text-left text-sm'>
            <thead className='bg-background/60 text-xs text-muted-foreground uppercase'>
              <tr>
                <th className='px-4 py-3'>Organization</th>
                <th className='px-4 py-3'>Internal people</th>
                <th className='px-4 py-3'>Maintainers</th>
                <th className='px-4 py-3'>12m change</th>
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
                    {compact(organization.activeMaintainers)}
                  </td>
                  <td
                    className={cn(
                      'px-4 py-3 font-semibold',
                      organization.activePeopleChange12m > 0 &&
                        'text-emerald-400',
                      organization.activePeopleChange12m < 0 && 'text-rose-400',
                    )}
                  >
                    {signed(organization.activePeopleChange12m)}
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
          <h2 className='text-2xl font-bold'>Largest observed team flows</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            Top organization-to-organization moves in the latest complete
            period. These are inferred from changes in primary internal
            affiliation, not profile claims.
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
        <strong className='text-foreground'>Population and limits.</strong>{' '}
        {report.population.definition} This report excludes{' '}
        {report.population.excludes.join(', ')}. Activity depth counts distinct
        active days; tenure begins with the first observed internal month.
        GitHub activity cannot observe private work and should be read as a
        lower bound. The battle-tested DBT employee model is the single
        definition used throughout this report and Ecosystem Vision.
      </section>
    </div>
  );
};
