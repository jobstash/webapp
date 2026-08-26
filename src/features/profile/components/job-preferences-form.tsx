'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import countryMetadata from '@d3-maps/atlas/metadata/countries';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { jobPreferencesSchema, type JobPreferences } from '../job-preferences';
import {
  COMMITMENT_OPTIONS,
  CURRENCY_OPTIONS,
  FUNDING_STAGE_OPTIONS,
  INDUSTRY_OPTIONS,
  JOB_CATEGORY_OPTIONS,
  LANGUAGE_OPTIONS,
  ROLE_PRIORITY_OPTIONS,
  SENIORITY_OPTIONS,
  SKILL_OPTIONS,
  WORK_MODE_OPTIONS,
} from '../job-preference-options';
import {
  JOB_PREFERENCE_FIELD_IDS,
  parseJobsForMeReturnTo,
} from '../jobs-for-me-resolution';
import { PreferenceMultiSelect } from './preference-multi-select';
import { ProfileCard } from './profile-card';

const COUNTRY_OPTIONS = [
  ...new Map(
    countryMetadata.flatMap((country) =>
      typeof country.isoA2 === 'string' && /^[A-Z]{2}$/.test(country.isoA2)
        ? ([[country.isoA2, country]] as const)
        : [],
    ),
  ).values(),
].sort((left, right) => left.name.localeCompare(right.name));

const isGithubRepositoryUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      url.hostname === 'github.com' &&
      url.pathname.split('/').filter(Boolean).length >= 2
    );
  } catch {
    return false;
  }
};

const responseError = async (response: Response): Promise<string> => {
  const body: unknown = await response.json().catch(() => null);
  if (!body || typeof body !== 'object') return 'Unable to save preferences';
  const error = body as { error?: unknown; message?: unknown };
  if (typeof error.error === 'string') return error.error;
  if (typeof error.message === 'string') return error.message;
  if (Array.isArray(error.message)) return error.message.join('. ');
  return 'Unable to save preferences';
};

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
  if (!response.ok) throw new Error(await responseError(response));
  return jobPreferencesSchema.parse(await response.json());
};

const fieldClass =
  'mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring';

export const JobPreferencesForm = () => {
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ['job-preferences'],
    queryFn: loadPreferences,
    throwOnError: false,
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
    throwOnError: false,
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

  const validation = jobPreferencesSchema.safeParse(draft);
  const validationMessage = validation.success
    ? null
    : validation.error.issues[0]?.message;

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
        <PreferenceMultiSelect
          label='What matters most'
          value={draft.rolePriorities}
          options={ROLE_PRIORITY_OPTIONS}
          placeholder='Choose priorities'
          searchPlaceholder='Search or add a priority…'
          allowCustom
          onChange={(rolePriorities) => setDraft({ ...draft, rolePriorities })}
          className='sm:col-span-2'
        />
        <PreferenceMultiSelect
          label='Job categories'
          value={draft.jobCategories}
          options={JOB_CATEGORY_OPTIONS}
          placeholder='Choose categories'
          onChange={(jobCategories) => setDraft({ ...draft, jobCategories })}
        />
        <PreferenceMultiSelect
          label='Seniority'
          value={draft.seniorityLevels}
          options={SENIORITY_OPTIONS}
          placeholder='Choose seniority levels'
          onChange={(seniorityLevels) =>
            setDraft({ ...draft, seniorityLevels })
          }
        />
        <PreferenceMultiSelect
          label='Skills'
          value={draft.preferredSkills}
          options={SKILL_OPTIONS}
          placeholder='Choose skills'
          searchPlaceholder='Search or add a skill…'
          allowCustom
          onChange={(preferredSkills) =>
            setDraft({ ...draft, preferredSkills })
          }
        />
        <PreferenceMultiSelect
          label='Industries'
          value={draft.industries}
          options={INDUSTRY_OPTIONS}
          placeholder='Choose industries'
          searchPlaceholder='Search or add an industry…'
          allowCustom
          onChange={(industries) => setDraft({ ...draft, industries })}
        />
        <PreferenceMultiSelect
          label='Commitment'
          value={draft.commitments}
          options={COMMITMENT_OPTIONS}
          placeholder='Choose commitments'
          onChange={(commitments) => setDraft({ ...draft, commitments })}
        />
      </div>

      <h3 className='mt-6 mb-3 text-sm font-semibold'>Company</h3>
      <div className='grid gap-4 sm:grid-cols-2'>
        <PreferenceMultiSelect
          label='Companies you want'
          value={draft.targetOrganizations}
          options={[]}
          placeholder='Choose or add companies'
          searchPlaceholder='Add a company…'
          allowCustom
          onChange={(targetOrganizations) =>
            setDraft({ ...draft, targetOrganizations })
          }
        />
        <PreferenceMultiSelect
          label='Funding stages'
          value={draft.fundingStages}
          options={FUNDING_STAGE_OPTIONS}
          placeholder='Choose funding stages'
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
          <select
            aria-label='Salary currency'
            className={fieldClass}
            value={draft.salaryCurrency ?? ''}
            onChange={(event) =>
              setDraft({
                ...draft,
                salaryCurrency: event.target.value || null,
              })
            }
          >
            <option value=''>Not stated</option>
            {CURRENCY_OPTIONS.filter((option) => option.value.length === 3).map(
              (option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ),
            )}
          </select>
        </label>
        <PreferenceMultiSelect
          label='Payment currencies'
          value={draft.paymentCurrencies}
          options={CURRENCY_OPTIONS}
          placeholder='Choose payment currencies'
          searchPlaceholder='Search or add a currency…'
          allowCustom
          normalizeCustom={(value) => value.trim().toUpperCase()}
          validateCustom={(value) => /^[A-Z]{2,10}$/.test(value)}
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
        <PreferenceMultiSelect
          label='Languages'
          value={draft.languages}
          options={LANGUAGE_OPTIONS}
          placeholder='Choose languages'
          searchPlaceholder='Search or add a language…'
          allowCustom
          onChange={(languages) => setDraft({ ...draft, languages })}
        />
        <PreferenceMultiSelect
          label='Showcase repositories'
          value={draft.showcaseRepositories}
          options={[]}
          placeholder='Add GitHub repositories'
          searchPlaceholder='Paste a GitHub repository URL…'
          allowCustom
          customLabel='Add repository'
          validateCustom={isGithubRepositoryUrl}
          onChange={(showcaseRepositories) =>
            setDraft({ ...draft, showcaseRepositories })
          }
        />
      </div>

      <h3 className='mt-6 mb-3 text-sm font-semibold'>Eligibility</h3>
      <div className='grid gap-4 sm:grid-cols-2'>
        <label className='text-sm'>
          Country
          <select
            id={JOB_PREFERENCE_FIELD_IDS.country}
            aria-label='Country'
            className={fieldClass}
            value={draft.residenceCountry ?? ''}
            onChange={(event) =>
              setDraft({
                ...draft,
                residenceCountry: event.target.value || null,
              })
            }
          >
            <option value=''>Not stated</option>
            {COUNTRY_OPTIONS.map((country) => (
              <option key={country.isoA2} value={country.isoA2}>
                {country.name}
              </option>
            ))}
          </select>
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
      <PreferenceMultiSelect
        label='Work modes you accept'
        value={draft.workModes}
        options={WORK_MODE_OPTIONS}
        placeholder='Choose work modes'
        onChange={(workModes) =>
          setDraft({
            ...draft,
            workModes: workModes as JobPreferences['workModes'],
          })
        }
        className='mt-4'
      />
      {draft.workModes.length === 0 && (
        <p className='mt-3 text-sm text-destructive'>
          Select at least one work mode above before saving.
        </p>
      )}
      {!validation.success && draft.workModes.length > 0 && (
        <p className='mt-3 text-sm text-destructive'>
          {validationMessage ?? 'Check the values above before saving.'}
        </p>
      )}
      {mutation.isError && (
        <p className='mt-3 text-sm text-destructive'>
          {mutation.error instanceof Error
            ? mutation.error.message
            : 'Your changes were not saved.'}
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
