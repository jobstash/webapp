'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { jobPreferencesSchema, type JobPreferences } from '../job-preferences';
import {
  JOB_PREFERENCE_FIELD_IDS,
  parseJobsForMeReturnTo,
} from '../jobs-for-me-resolution';
import { ProfileCard } from './profile-card';

const loadPreferences = async (): Promise<JobPreferences> => {
  const response = await fetch('/api/profile/job-preferences', {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Unable to load job preferences');
  return jobPreferencesSchema.parse(await response.json());
};

const savePreferences = async (preferences: JobPreferences) => {
  const response = await fetch('/api/profile/job-preferences', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences),
  });
  if (!response.ok) throw new Error('Unable to save job preferences');
  return jobPreferencesSchema.parse(await response.json());
};

const fieldClass =
  'mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring';

export const JobPreferencesForm = () => {
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ['job-preferences'],
    queryFn: loadPreferences,
  });
  const [draft, setDraft] = useState<JobPreferences | null>(null);
  const [returnTo, setReturnTo] = useState<string | null>(null);
  const focusedHash = useRef<string | null>(null);

  useEffect(() => {
    if (query.data) setDraft(query.data);
  }, [query.data]);

  useEffect(() => {
    setReturnTo(
      parseJobsForMeReturnTo(
        new URLSearchParams(window.location.search).get('returnTo'),
      ),
    );
  }, []);

  useEffect(() => {
    if (!draft) return;
    const hash = window.location.hash.slice(1);
    const isPreferenceField = Object.values(JOB_PREFERENCE_FIELD_IDS).some(
      (fieldId) => fieldId === hash,
    );
    if (!isPreferenceField || focusedHash.current === hash) return;

    document.getElementById(hash)?.focus();
    focusedHash.current = hash;
  }, [draft]);

  const mutation = useMutation({
    mutationFn: savePreferences,
    onSuccess: (data) => {
      client.setQueryData(['job-preferences'], data);
      void client.invalidateQueries({ queryKey: ['jobs-for-me'] });
      setDraft(data);
    },
  });

  if (query.isPending) {
    return (
      <ProfileCard title='Where you can work'>
        <p className='text-sm text-muted-foreground'>
          Loading your preferences…
        </p>
      </ProfileCard>
    );
  }
  if (query.isError || !draft) {
    return (
      <ProfileCard title='Where you can work'>
        <p className='text-sm text-muted-foreground'>
          We could not load your preferences.
        </p>
        <Button className='mt-3' size='sm' onClick={() => query.refetch()}>
          Retry
        </Button>
      </ProfileCard>
    );
  }

  const toggleMode = (mode: JobPreferences['workModes'][number]) => {
    setDraft((current) => {
      if (!current) return current;
      const selected = current.workModes.includes(mode);
      return {
        ...current,
        workModes: selected
          ? current.workModes.filter((item) => item !== mode)
          : [...current.workModes, mode],
      };
    });
  };

  const validation = jobPreferencesSchema.safeParse(draft);

  return (
    <ProfileCard
      title='Where you can work'
      className='scroll-mt-24'
      id='job-preferences'
    >
      <p className='mb-4 text-sm text-muted-foreground'>
        Used only to explain which jobs have a compatible work option. Unstated
        eligibility stays marked as needing checking.
      </p>
      <div className='grid gap-4 sm:grid-cols-2'>
        <label className='text-sm'>
          Country (two-letter code)
          <input
            id={JOB_PREFERENCE_FIELD_IDS.country}
            className={fieldClass}
            value={draft.residenceCountry ?? ''}
            maxLength={2}
            placeholder='NL'
            onChange={(event) =>
              setDraft({
                ...draft,
                residenceCountry: event.target.value.toUpperCase() || null,
              })
            }
          />
        </label>
        <label className='text-sm'>
          UTC offset
          <input
            id={JOB_PREFERENCE_FIELD_IDS.utcOffset}
            aria-label='UTC offset'
            type='number'
            min={-12}
            max={14}
            step={0.25}
            className={fieldClass}
            value={draft.utcOffset ?? ''}
            placeholder='+1'
            onChange={(event) =>
              setDraft({
                ...draft,
                utcOffset:
                  event.target.value === '' ? null : Number(event.target.value),
              })
            }
          />
          <span className='mt-1 block text-xs text-muted-foreground'>
            Fractional offsets such as +5.5 and +5.75 are supported.
          </span>
        </label>
        <label className='text-sm'>
          Work authorization
          <input
            id={JOB_PREFERENCE_FIELD_IDS.workAuthorization}
            className={fieldClass}
            value={draft.workAuthorization ?? ''}
            placeholder='EU / Netherlands'
            onChange={(event) =>
              setDraft({
                ...draft,
                workAuthorization: event.target.value.trim() || null,
              })
            }
          />
        </label>
        <label className='text-sm'>
          Sponsorship need
          <select
            id={JOB_PREFERENCE_FIELD_IDS.sponsorship}
            className={fieldClass}
            value={
              draft.requiresSponsorship === null
                ? 'unstated'
                : String(draft.requiresSponsorship)
            }
            onChange={(event) =>
              setDraft({
                ...draft,
                requiresSponsorship:
                  event.target.value === 'unstated'
                    ? null
                    : event.target.value === 'true',
              })
            }
          >
            <option value='unstated'>Not stated</option>
            <option value='false'>I do not need sponsorship</option>
            <option value='true'>I need sponsorship</option>
          </select>
        </label>
        <label className='text-sm'>
          Attendance preference
          <input
            id={JOB_PREFERENCE_FIELD_IDS.attendancePreference}
            className={fieldClass}
            value={draft.attendancePreference ?? ''}
            placeholder='Remote only / up to 1 day a week'
            onChange={(event) =>
              setDraft({
                ...draft,
                attendancePreference: event.target.value.trim() || null,
              })
            }
          />
        </label>
        <label className='text-sm'>
          Travel tolerance
          <input
            id={JOB_PREFERENCE_FIELD_IDS.travelTolerance}
            className={fieldClass}
            value={draft.travelTolerance ?? ''}
            placeholder='Occasional travel'
            onChange={(event) =>
              setDraft({
                ...draft,
                travelTolerance: event.target.value || null,
              })
            }
          />
        </label>
      </div>
      <fieldset className='mt-4'>
        <legend className='text-sm font-medium'>Work modes you accept</legend>
        <div className='mt-2 flex flex-wrap gap-3'>
          {(
            [
              ['remote', 'Remote'],
              ['hybrid', 'Hybrid'],
              ['onsite', 'On-site'],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className='flex items-center gap-2 text-sm'>
              <input
                type='checkbox'
                checked={draft.workModes.includes(value)}
                onChange={() => toggleMode(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      {draft.workModes.length === 0 && (
        <p className='mt-3 text-sm text-destructive'>
          Select at least one work mode above before saving.
        </p>
      )}
      {!validation.success && draft.workModes.length > 0 && (
        <p className='mt-3 text-sm text-destructive'>
          Check that the country and UTC offset use the formats shown above.
        </p>
      )}
      {mutation.isError && (
        <p className='mt-3 text-sm text-destructive'>
          Your changes were not saved. Retry or cancel to restore the previous
          values.
        </p>
      )}
      {mutation.isSuccess && (
        <p className='mt-3 text-sm text-muted-foreground'>Preferences saved.</p>
      )}
      <div className='mt-4 flex gap-2'>
        <Button
          size='sm'
          disabled={mutation.isPending || !validation.success}
          onClick={() => mutation.mutate(draft)}
        >
          {mutation.isError ? 'Retry save' : 'Save preferences'}
        </Button>
        <Button
          size='sm'
          variant='secondary'
          disabled={mutation.isPending}
          onClick={() => setDraft(query.data ?? null)}
        >
          Cancel
        </Button>
        {returnTo && (
          <Button size='sm' variant='ghost' asChild>
            <Link href={returnTo}>Back to Jobs for me</Link>
          </Button>
        )}
      </div>
    </ProfileCard>
  );
};
