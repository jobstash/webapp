'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';

import { jobPreferencesSchema, type JobPreferences } from '../job-preferences';
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
  useEffect(() => {
    if (query.data) setDraft(query.data);
  }, [query.data]);
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

  const toggleMode = (mode: JobPreferences['acceptableWorkModes'][number]) => {
    setDraft((current) => {
      if (!current) return current;
      const selected = current.acceptableWorkModes.includes(mode);
      return {
        ...current,
        acceptableWorkModes: selected
          ? current.acceptableWorkModes.filter((item) => item !== mode)
          : [...current.acceptableWorkModes, mode],
      };
    });
  };

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
          Region
          <input
            className={fieldClass}
            value={draft.residenceRegion ?? ''}
            placeholder='EU'
            onChange={(event) =>
              setDraft({
                ...draft,
                residenceRegion: event.target.value || null,
              })
            }
          />
        </label>
        <label className='text-sm'>
          IANA timezone
          <input
            className={fieldClass}
            value={draft.ianaTimezone ?? ''}
            placeholder='Europe/Amsterdam'
            onChange={(event) =>
              setDraft({ ...draft, ianaTimezone: event.target.value || null })
            }
          />
        </label>
        <label className='text-sm'>
          Work authorization
          <input
            className={fieldClass}
            value={draft.workAuthorizations.join(', ')}
            placeholder='EU, NL'
            onChange={(event) =>
              setDraft({
                ...draft,
                workAuthorizations: event.target.value
                  .split(',')
                  .map((item) => item.trim())
                  .filter(Boolean),
              })
            }
          />
        </label>
        <label className='text-sm'>
          Sponsorship need
          <select
            className={fieldClass}
            value={
              draft.needsSponsorship === null
                ? 'unstated'
                : String(draft.needsSponsorship)
            }
            onChange={(event) =>
              setDraft({
                ...draft,
                needsSponsorship:
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
          Travel tolerance
          <input
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
              ['remote_or_office', 'Remote or office'],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className='flex items-center gap-2 text-sm'>
              <input
                type='checkbox'
                checked={draft.acceptableWorkModes.includes(value)}
                onChange={() => toggleMode(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <label className='mt-4 flex items-start gap-2 text-sm'>
        <input
          type='checkbox'
          className='mt-1'
          checked={draft.useInferredCollaborationHours}
          onChange={(event) =>
            setDraft({
              ...draft,
              useInferredCollaborationHours: event.target.checked,
            })
          }
        />
        Allow team-level collaboration hours inferred from credited GitHub
        activity. This signal does not affect ranking yet.
      </label>
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
          disabled={
            mutation.isPending || draft.acceptableWorkModes.length === 0
          }
          onClick={() => mutation.mutate(draft)}
        >
          Save preferences
        </Button>
        <Button
          size='sm'
          variant='secondary'
          disabled={mutation.isPending}
          onClick={() => setDraft(query.data ?? null)}
        >
          Cancel
        </Button>
      </div>
    </ProfileCard>
  );
};
