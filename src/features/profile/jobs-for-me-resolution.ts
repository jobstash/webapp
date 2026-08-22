import type { JobMatchResolutionCode } from './job-preferences';

export const JOBS_FOR_ME_ROUTE = '/profile/jobs';
export const JOB_PREFERENCES_ROUTE = '/profile/settings';

export const JOB_PREFERENCE_FIELD_IDS = {
  country: 'job-preferences-residence-country',
  utcOffset: 'job-preferences-utc-offset',
  workAuthorization: 'job-preferences-work-authorization',
  sponsorship: 'job-preferences-sponsorship',
  attendancePreference: 'job-preferences-attendance-preference',
  travelTolerance: 'job-preferences-travel-tolerance',
} as const;

export type PreferenceField = keyof typeof JOB_PREFERENCE_FIELD_IDS;

export interface NeedsCheckingAction {
  href: string;
  label: string;
  kind: 'job-preferences' | 'job-details';
}

type ResolutionTarget =
  | {
      kind: 'job-preferences';
      field: PreferenceField;
      label: string;
    }
  | {
      kind: 'job-details';
      label: string;
    };

const RESOLUTION_TARGETS: Readonly<
  Record<JobMatchResolutionCode, ResolutionTarget>
> = {
  add_country_for_exclusions: {
    kind: 'job-preferences',
    field: 'country',
    label: 'Add country',
  },
  add_country_for_eligibility: {
    kind: 'job-preferences',
    field: 'country',
    label: 'Add country',
  },
  geographic_scope_unstated: {
    kind: 'job-details',
    label: 'View job details',
  },
  location_eligibility_incomplete: {
    kind: 'job-details',
    label: 'View job details',
  },
  conflicting_work_arrangement: {
    kind: 'job-details',
    label: 'View job details',
  },
  remote_evidence_unqualified: {
    kind: 'job-details',
    label: 'View job details',
  },
  work_arrangement_unstated: {
    kind: 'job-details',
    label: 'View job details',
  },
  add_utc_offset: {
    kind: 'job-preferences',
    field: 'utcOffset',
    label: 'Add UTC offset',
  },
  work_authorization_review: {
    kind: 'job-preferences',
    field: 'workAuthorization',
    label: 'Review work authorization',
  },
  residency_review: {
    kind: 'job-details',
    label: 'View job details',
  },
  travel_tolerance_review: {
    kind: 'job-preferences',
    field: 'travelTolerance',
    label: 'Review travel tolerance',
  },
  attendance_review: {
    kind: 'job-preferences',
    field: 'attendancePreference',
    label: 'Review attendance preference',
  },
  office_location_review: {
    kind: 'job-details',
    label: 'View job details',
  },
  office_location_missing: {
    kind: 'job-details',
    label: 'View job details',
  },
  sponsorship_unstated: {
    kind: 'job-details',
    label: 'View job details',
  },
  set_sponsorship_preference: {
    kind: 'job-preferences',
    field: 'sponsorship',
    label: 'Set sponsorship preference',
  },
};

export const buildJobPreferencesHref = (
  field: PreferenceField | null,
  returnTo = JOBS_FOR_ME_ROUTE,
): string =>
  `${JOB_PREFERENCES_ROUTE}?returnTo=${encodeURIComponent(returnTo)}#${
    field ? JOB_PREFERENCE_FIELD_IDS[field] : 'job-preferences'
  }`;

export const resolveNeedsCheckingAction = (
  code: JobMatchResolutionCode,
  jobHref: string,
  returnTo = JOBS_FOR_ME_ROUTE,
): NeedsCheckingAction => {
  const target = RESOLUTION_TARGETS[code];
  if (target.kind === 'job-preferences') {
    return {
      href: buildJobPreferencesHref(target.field, returnTo),
      label: target.label,
      kind: 'job-preferences',
    };
  }

  return {
    href: jobHref,
    label: target.label,
    kind: 'job-details',
  };
};

export const parseJobsForMeReturnTo = (value: string | null): string | null => {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return null;

  try {
    const origin = 'https://jobstash.local';
    const url = new URL(value, origin);
    if (url.origin !== origin || url.pathname !== JOBS_FOR_ME_ROUTE)
      return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
};
