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

const parseList = (value: string): string[] => [
  ...new Set(
    value
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter(Boolean),
  ),
];

const ListField = ({
  label,
  value,
  placeholder,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string[];
  placeholder: string;
  onChange: (value: string[]) => void;
  multiline?: boolean;
}) => {
  const separator = multiline ? '\n' : ', ';
  const [raw, setRaw] = useState(value.join(separator));

  useEffect(() => {
    const current = parseList(raw);
    if (
      current.length !== value.length ||
      current.some((item, index) => item !== value[index])
    ) {
      setRaw(value.join(separator));
    }
  }, [raw, separator, value]);

  const update = (next: string) => {
    setRaw(next);
    onChange(parseList(next));
  };

  return (
    <label className={multiline ? 'text-sm sm:col-span-2' : 'text-sm'}>
      {label}
      {multiline ? (
        <textarea
          aria-label={label}
          className={`${fieldClass} min-h-20 resize-y`}
          value={raw}
          placeholder={placeholder}
          onChange={(event) => update(event.target.value)}
        />
      ) : (
        <input
          aria-label={label}
          className={fieldClass}
          value={raw}
          placeholder={placeholder}
          onChange={(event) => update(event.target.value)}
        />
      )}
    </label>
  );
};

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
      <ProfileCard title='Your next role'>
        <p className='text-sm text-muted-foreground'>
          Loading your preferences…
        </p>
      </ProfileCard>
    );
  }
  if (query.isError || !draft) {
    return (
      <ProfileCard title='Your next role'>
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
      title='Your next role'
      className='scroll-mt-24'
      id='job-preferences'
    >
      <p className='mb-5 text-sm text-muted-foreground'>
        Tell us what fits. We learn from your activity too.
      </p>
      <h3 className='mb-3 text-sm font-semibold'>Role</h3>
      <div className='grid gap-4 sm:grid-cols-2'>
        <ListField
          label='What matters most'
          value={draft.rolePriorities}
          placeholder={'Mission-driven\nSmall team\nTechnical ownership'}
          multiline
          onChange={(rolePriorities) => setDraft({ ...draft, rolePriorities })}
        />
        <ListField
          label='Job categories'
          value={draft.jobCategories}
          placeholder='Engineering, Product Management'
          onChange={(jobCategories) => setDraft({ ...draft, jobCategories })}
        />
        <ListField
          label='Seniority'
          value={draft.seniorityLevels}
          placeholder='Senior, Lead'
          onChange={(seniorityLevels) =>
            setDraft({ ...draft, seniorityLevels })
          }
        />
        <ListField
          label='Skills'
          value={draft.preferredSkills}
          placeholder='TypeScript, Solidity, Rust'
          onChange={(preferredSkills) =>
            setDraft({ ...draft, preferredSkills })
          }
        />
        <ListField
          label='Industries'
          value={draft.industries}
          placeholder='Infrastructure, AI, Fintech'
          onChange={(industries) => setDraft({ ...draft, industries })}
        />
        <ListField
          label='Commitment'
          value={draft.commitments}
          placeholder='Full Time, Contract'
          onChange={(commitments) => setDraft({ ...draft, commitments })}
        />
      </div>

      <h3 className='mt-6 mb-3 text-sm font-semibold'>Company</h3>
      <div className='grid gap-4 sm:grid-cols-2'>
        <ListField
          label='Companies you want'
          value={draft.targetOrganizations}
          placeholder='Protocol Labs, OpenAI'
          onChange={(targetOrganizations) =>
            setDraft({ ...draft, targetOrganizations })
          }
        />
        <ListField
          label='Funding stages'
          value={draft.fundingStages}
          placeholder='Seed, Series A, Profitable'
          onChange={(fundingStages) => setDraft({ ...draft, fundingStages })}
        />
        <label className='text-sm'>
          Minimum company size
          <input
            aria-label='Minimum company size'
            type='number'
            min={0}
            className={fieldClass}
            value={draft.companySizeMin ?? ''}
            onChange={(event) =>
              setDraft({
                ...draft,
                companySizeMin:
                  event.target.value === '' ? null : Number(event.target.value),
              })
            }
          />
        </label>
        <label className='text-sm'>
          Maximum company size
          <input
            aria-label='Maximum company size'
            type='number'
            min={0}
            className={fieldClass}
            value={draft.companySizeMax ?? ''}
            onChange={(event) =>
              setDraft({
                ...draft,
                companySizeMax:
                  event.target.value === '' ? null : Number(event.target.value),
              })
            }
          />
        </label>
      </div>

      <h3 className='mt-6 mb-3 text-sm font-semibold'>Offer</h3>
      <div className='grid gap-4 sm:grid-cols-2'>
        <label className='text-sm'>
          Minimum annual salary
          <input
            aria-label='Minimum annual salary'
            type='number'
            min={0}
            className={fieldClass}
            value={draft.minimumSalary ?? ''}
            onChange={(event) =>
              setDraft({
                ...draft,
                minimumSalary:
                  event.target.value === '' ? null : Number(event.target.value),
              })
            }
          />
        </label>
        <label className='text-sm'>
          Salary currency
          <input
            aria-label='Salary currency'
            className={fieldClass}
            maxLength={3}
            value={draft.salaryCurrency ?? ''}
            placeholder='USD'
            onChange={(event) =>
              setDraft({
                ...draft,
                salaryCurrency: event.target.value.toUpperCase() || null,
              })
            }
          />
        </label>
        <ListField
          label='Payment currencies'
          value={draft.paymentCurrencies}
          placeholder='USD, EUR, USDC'
          onChange={(paymentCurrencies) =>
            setDraft({
              ...draft,
              paymentCurrencies: paymentCurrencies.map((value) =>
                value.toUpperCase(),
              ),
            })
          }
        />
      </div>

      <h3 className='mt-6 mb-3 text-sm font-semibold'>About you</h3>
      <div className='grid gap-4 sm:grid-cols-2'>
        <label className='text-sm'>
          Search status
          <select
            aria-label='Search status'
            className={fieldClass}
            value={draft.searchStatus ?? ''}
            onChange={(event) =>
              setDraft({
                ...draft,
                searchStatus:
                  event.target.value === ''
                    ? null
                    : (event.target.value as JobPreferences['searchStatus']),
              })
            }
          >
            <option value=''>Not stated</option>
            <option value='not_looking'>Not looking</option>
            <option value='open'>Open</option>
            <option value='active'>Actively looking</option>
            <option value='immediate'>Available now</option>
          </select>
        </label>
        <label className='text-sm'>
          Education
          <select
            aria-label='Education'
            className={fieldClass}
            value={draft.educationLevel ?? ''}
            onChange={(event) =>
              setDraft({
                ...draft,
                educationLevel:
                  event.target.value === ''
                    ? null
                    : (event.target.value as JobPreferences['educationLevel']),
              })
            }
          >
            <option value=''>Not stated</option>
            <option value='secondary'>Secondary</option>
            <option value='associate'>Associate</option>
            <option value='bachelor'>Bachelor</option>
            <option value='master'>Master</option>
            <option value='doctorate'>Doctorate</option>
            <option value='other'>Other</option>
          </select>
        </label>
        <ListField
          label='Languages and level'
          value={draft.languages}
          placeholder='English: native, Dutch: professional'
          onChange={(languages) => setDraft({ ...draft, languages })}
        />
        <ListField
          label='Showcase repositories'
          value={draft.showcaseRepositories}
          placeholder={
            'https://github.com/you/project\nhttps://github.com/you/tool'
          }
          multiline
          onChange={(showcaseRepositories) =>
            setDraft({ ...draft, showcaseRepositories })
          }
        />
      </div>

      <h3 className='mt-6 mb-3 text-sm font-semibold'>Eligibility</h3>
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
          <select
            id={JOB_PREFERENCE_FIELD_IDS.attendancePreference}
            className={fieldClass}
            value={draft.attendancePreference ?? ''}
            onChange={(event) =>
              setDraft({
                ...draft,
                attendancePreference:
                  event.target.value === ''
                    ? null
                    : (event.target
                        .value as JobPreferences['attendancePreference']),
              })
            }
          >
            <option value=''>Not stated</option>
            <option value='remote_only'>Remote only</option>
            <option value='remote_preferred'>Remote preferred</option>
            <option value='hybrid_ok'>Hybrid is fine</option>
            <option value='onsite_ok'>On-site is fine</option>
          </select>
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
          Check the values above before saving.
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
