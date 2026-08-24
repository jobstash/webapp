'use client';

import Link from 'next/link';
import {
  AlertCircleIcon,
  Clock3Icon,
  RefreshCwIcon,
  SearchIcon,
  SettingsIcon,
  ShieldCheckIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { JobListItem } from '@/features/jobs/components/job-list/job-list-item/job-list-item';
import { JobListItemSkeleton } from '@/features/jobs/components/job-list/job-list-item/job-list-item.skeleton';

import type {
  JobForMe,
  JobPreferences,
  JobsForMeResponse,
} from '../job-preferences';
import {
  buildJobPreferencesHref,
  resolveNeedsCheckingAction,
} from '../jobs-for-me-resolution';
import { useJobsForMe } from '../hooks/use-jobs-for-me';
import { ProfileCard } from './profile-card';

const formatUtcOffset = (offset: number | null): string => {
  if (offset === null) return 'Not set';
  const sign = offset >= 0 ? '+' : '-';
  const absolute = Math.abs(offset);
  const hours = Math.floor(absolute);
  const minutes = Math.round((absolute - hours) * 60);
  return `UTC${sign}${hours}${minutes ? `:${String(minutes).padStart(2, '0')}` : ''}`;
};

const valueOrNotSet = (value: string | null): string => value ?? 'Not set';

const AppliedPreferences = ({
  preferences,
}: {
  preferences: JobPreferences;
}) => {
  const entries = [
    ['Work modes', preferences.workModes.join(', ')],
    ['Residence', valueOrNotSet(preferences.residenceCountry)],
    ['UTC offset', formatUtcOffset(preferences.utcOffset)],
    ['Work authorization', valueOrNotSet(preferences.workAuthorization)],
    [
      'Requires sponsorship',
      preferences.requiresSponsorship === null
        ? 'Not set'
        : preferences.requiresSponsorship
          ? 'Yes'
          : 'No',
    ],
    ['Attendance', valueOrNotSet(preferences.attendancePreference)],
    ['Travel', valueOrNotSet(preferences.travelTolerance)],
  ] as const;

  return (
    <details
      open
      className='mt-4 rounded-lg border border-border/50 bg-muted/30 px-3 py-2'
    >
      <summary className='cursor-pointer text-xs font-medium'>
        Applied preferences
      </summary>
      <dl className='mt-2 grid gap-x-4 gap-y-1 text-xs sm:grid-cols-2'>
        {entries.map(([label, value]) => (
          <div key={label} className='flex justify-between gap-3'>
            <dt className='text-muted-foreground'>{label}</dt>
            <dd className='text-right'>{value}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
};

const ExcludedLocations = ({
  countries,
  regions,
}: {
  countries: string[];
  regions: string[];
}) => {
  if (countries.length === 0 && regions.length === 0) return null;

  return (
    <div
      className='mt-3 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground'
      aria-label='Excluded locations'
    >
      <p className='font-medium text-foreground'>Not available in</p>
      {countries.length > 0 && <p>Countries: {countries.join(', ')}</p>}
      {regions.length > 0 && <p>Regions: {regions.join(', ')}</p>}
    </div>
  );
};

type ResultKind = 'confirmedMatches' | 'timezoneNearMisses' | 'needsChecking';

const RESULT_COPY: Record<
  ResultKind,
  { id: string; title: string; itemTitle: string; description: string }
> = {
  confirmedMatches: {
    id: 'jobs-for-me-confirmed',
    title: 'Confirmed matches',
    itemTitle: 'Confirmed where you can work',
    description:
      'The employer information confirms a compatible work option for your saved preferences.',
  },
  timezoneNearMisses: {
    id: 'jobs-for-me-timezone-near-misses',
    title: 'Timezone near misses',
    itemTitle: 'Timezone near miss',
    description:
      'Your UTC offset is no more than one hour outside a required employer band.',
  },
  needsChecking: {
    id: 'jobs-for-me-needs-checking',
    title: 'Needs checking',
    itemTitle: 'Needs checking',
    description:
      'A geographic or legal requirement is unstated or cannot yet be proved compatible.',
  },
};

const MatchCard = ({ match, kind }: { match: JobForMe; kind: ResultKind }) => (
  <div className='space-y-2'>
    <JobListItem job={match.job} />
    <div className='rounded-xl border border-border/50 bg-card px-4 py-3 text-sm'>
      <p className='font-medium'>{RESULT_COPY[kind].itemTitle}</p>
      <p className='mt-1 text-muted-foreground'>{match.explanation}</p>
      {match.option && (
        <ExcludedLocations
          countries={match.option.excludedCountries}
          regions={match.option.excludedRegions}
        />
      )}
      {match.needsChecking.length > 0 && (
        <ul className='mt-3 space-y-2 text-muted-foreground'>
          {match.needsChecking.map((item) => {
            const action = resolveNeedsCheckingAction(
              item.code,
              match.job.href,
            );
            return (
              <li
                key={item.code}
                className='flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 px-3 py-2'
              >
                <span>{item.message}</span>
                <Button size='sm' variant='secondary' asChild>
                  <Link href={action.href}>{action.label}</Link>
                </Button>
              </li>
            );
          })}
        </ul>
      )}
      {match.optionalSignals.map((signal) => (
        <p key={signal} className='mt-2 text-xs text-muted-foreground'>
          {signal}
        </p>
      ))}
    </div>
  </div>
);

const ResultSection = ({
  kind,
  matches,
}: {
  kind: ResultKind;
  matches: JobForMe[];
}) => {
  if (matches.length === 0) return null;
  const Icon =
    kind === 'confirmedMatches'
      ? ShieldCheckIcon
      : kind === 'timezoneNearMisses'
        ? Clock3Icon
        : AlertCircleIcon;

  return (
    <section className='space-y-4' aria-labelledby={RESULT_COPY[kind].id}>
      <div>
        <h2
          id={RESULT_COPY[kind].id}
          className='flex items-center gap-2 text-lg font-semibold'
        >
          <Icon className='size-4' /> {RESULT_COPY[kind].title} (
          {matches.length})
        </h2>
        <p className='mt-1 text-sm text-muted-foreground'>
          {RESULT_COPY[kind].description}
        </p>
      </div>
      {matches.map((match) => (
        <MatchCard key={`${kind}-${match.job.id}`} match={match} kind={kind} />
      ))}
    </section>
  );
};

const hasResults = (response: JobsForMeResponse): boolean =>
  response.summary.total > 0;

export const JobsForMe = () => {
  const { data, isPending, isError, refetch, isFetching } = useJobsForMe();

  if (isPending) {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 3 }).map((_, index) => (
          <JobListItemSkeleton key={index} />
        ))}
      </div>
    );
  }
  if (isError || !data) {
    return (
      <ProfileCard title='Jobs for me'>
        <div className='flex flex-col items-center gap-3 py-6'>
          <AlertCircleIcon className='size-8 text-destructive' />
          <p className='text-center text-sm text-muted-foreground'>
            We could not check your matches.
          </p>
          <div className='flex gap-2'>
            <Button size='sm' onClick={() => refetch()} disabled={isFetching}>
              <RefreshCwIcon className='size-4' /> Retry
            </Button>
            <Button size='sm' variant='secondary' asChild>
              <Link href='/'>Browse all jobs</Link>
            </Button>
          </div>
        </div>
      </ProfileCard>
    );
  }
  if (!hasResults(data)) {
    return (
      <ProfileCard title='Jobs for me'>
        <div className='flex flex-col items-center gap-3 py-6'>
          <SearchIcon className='size-8 text-muted-foreground/50' />
          <p className='text-center text-sm text-muted-foreground'>
            No current jobs have a work option that matches your saved
            preferences.
          </p>
          <AppliedPreferences preferences={data.appliedPreferences} />
          <div className='flex gap-2'>
            <Button size='sm' asChild>
              <Link href={buildJobPreferencesHref(null)}>
                <SettingsIcon className='size-4' /> Update preferences
              </Link>
            </Button>
            <Button size='sm' variant='secondary' asChild>
              <Link href='/'>Browse all jobs</Link>
            </Button>
          </div>
        </div>
      </ProfileCard>
    );
  }

  return (
    <div className='space-y-8'>
      <ProfileCard title='Jobs for me'>
        <p className='text-sm text-muted-foreground'>
          Results distinguish proven compatibility, one-hour timezone near
          misses, and eligibility that still needs checking. Unstated scope is
          never presented as global.
        </p>
        <AppliedPreferences preferences={data.appliedPreferences} />
      </ProfileCard>
      <ResultSection kind='confirmedMatches' matches={data.confirmedMatches} />
      <ResultSection
        kind='timezoneNearMisses'
        matches={data.timezoneNearMisses}
      />
      <ResultSection kind='needsChecking' matches={data.needsChecking} />
    </div>
  );
};
