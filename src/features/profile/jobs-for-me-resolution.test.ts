import { describe, expect, it } from 'vitest';

import {
  JOB_PREFERENCE_FIELD_IDS,
  parseJobsForMeReturnTo,
  resolveNeedsCheckingAction,
} from './jobs-for-me-resolution';

describe('resolveNeedsCheckingAction', () => {
  it.each([
    [
      'add_country_for_exclusions',
      'Add country',
      JOB_PREFERENCE_FIELD_IDS.country,
    ],
    [
      'add_country_for_eligibility',
      'Add country',
      JOB_PREFERENCE_FIELD_IDS.country,
    ],
    ['add_utc_offset', 'Add UTC offset', JOB_PREFERENCE_FIELD_IDS.utcOffset],
    [
      'work_authorization_review',
      'Review work authorization',
      JOB_PREFERENCE_FIELD_IDS.workAuthorization,
    ],
    [
      'set_sponsorship_preference',
      'Set sponsorship preference',
      JOB_PREFERENCE_FIELD_IDS.sponsorship,
    ],
    [
      'travel_tolerance_review',
      'Review travel tolerance',
      JOB_PREFERENCE_FIELD_IDS.travelTolerance,
    ],
    [
      'attendance_review',
      'Review attendance preference',
      JOB_PREFERENCE_FIELD_IDS.attendancePreference,
    ],
  ] as const)(
    'maps %s to its exact preference field',
    (code, label, fieldId) => {
      expect(resolveNeedsCheckingAction(code, '/job/example')).toEqual({
        href: `/profile/settings?returnTo=%2Fprofile%2Fjobs#${fieldId}`,
        label,
        kind: 'job-preferences',
      });
    },
  );

  it.each([
    'geographic_scope_unstated',
    'location_eligibility_incomplete',
    'conflicting_work_arrangement',
    'remote_evidence_unqualified',
    'work_arrangement_unstated',
    'residency_review',
    'office_location_review',
    'office_location_missing',
    'sponsorship_unstated',
  ] as const)(
    'sends employer-side check %s to the exact job detail route',
    (code) => {
      expect(
        resolveNeedsCheckingAction(code, '/engineering/example-job-123'),
      ).toEqual({
        href: '/engineering/example-job-123',
        label: 'View job details',
        kind: 'job-details',
      });
    },
  );
});

describe('parseJobsForMeReturnTo', () => {
  it('preserves the registered Jobs for me route, including its state', () => {
    expect(parseJobsForMeReturnTo('/profile/jobs?view=compact#match-1')).toBe(
      '/profile/jobs?view=compact#match-1',
    );
  });

  it.each([
    'https://example.com/profile/jobs',
    '//example.com/profile/jobs',
    '/market',
  ])('rejects unsafe or unrelated return target %s', (returnTo) => {
    expect(parseJobsForMeReturnTo(returnTo)).toBeNull();
  });
});
