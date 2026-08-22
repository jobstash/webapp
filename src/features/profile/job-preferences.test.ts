import { describe, expect, it } from 'vitest';

import {
  jobPreferencesSchema,
  jobsForMeResponseSchema,
  workArrangementOptionSchema,
} from './job-preferences';

const quote = 'Remote worldwide, except the US and APAC.';
const option = {
  classification: 'verified_remote' as const,
  mode: 'remote' as const,
  scope: 'global' as const,
  includedCountries: [],
  excludedCountries: ['US'],
  includedRegions: [],
  excludedRegions: ['APAC'] as const,
  requiredUtcBand: null,
  preferredUtcBand: {
    minimumUtcOffset: -1,
    maximumUtcOffset: 3.5,
  },
  residencyRequirements: [],
  workAuthorizationRequirements: [],
  sponsorshipStatus: 'unstated' as const,
  officeCity: null,
  attendanceCadence: null,
  travelRequirement: null,
  confidence: 'source_stated' as const,
  evidence: [
    {
      quote,
      startOffset: 100,
      endOffset: 100 + quote.length,
      source: 'employer_body' as const,
      trust: 'employer_body' as const,
      provenance: 'job.description',
    },
  ],
};

const preferences = {
  workModes: ['remote'] as const,
  residenceCountry: 'NL',
  utcOffset: 5.75,
  workAuthorization: 'EU',
  requiresSponsorship: false,
  attendancePreference: 'Remote only',
  travelTolerance: 'Once per quarter',
};

const job = {
  id: 'job-1',
  title: 'Protocol engineer',
  href: '/engineering/protocol-engineer-job-1',
  hasApplyUrl: true,
  classification: null,
  summary: null,
  location: 'Worldwide',
  locationType: 'Remote',
  addresses: null,
  infoTags: [],
  tags: [],
  availability: [],
  organization: null,
  timestampText: 'Today',
  datePosted: '2026-08-22',
  badge: null,
};

const match = {
  job,
  option,
  explanation: 'The employer explicitly supports remote work worldwide.',
  needsChecking: [],
  optionalSignals: [],
};

describe('jobPreferencesSchema', () => {
  it('accepts the seven canonical fields and fractional UTC offsets', () => {
    expect(jobPreferencesSchema.parse(preferences)).toEqual(preferences);
  });

  it.each([
    ['acceptableWorkModes', ['remote']],
    ['ianaTimezone', 'Europe/Amsterdam'],
    ['workAuthorizations', ['EU']],
    ['needsSponsorship', false],
    ['residenceRegion', 'EU'],
  ])('rejects removed alias %s', (key, value) => {
    expect(
      jobPreferencesSchema.safeParse({ ...preferences, [key]: value }).success,
    ).toBe(false);
  });
});

describe('workArrangementOptionSchema', () => {
  it('keeps exclusions, distinct EU/Europe regions, and separate UTC bands', () => {
    const parsed = workArrangementOptionSchema.parse({
      ...option,
      includedRegions: ['EU'],
      excludedRegions: ['Europe'],
      requiredUtcBand: { minimumUtcOffset: 5.5, maximumUtcOffset: 5.75 },
    });

    expect(parsed.includedRegions).toEqual(['EU']);
    expect(parsed.excludedRegions).toEqual(['Europe']);
    expect(parsed.requiredUtcBand).toEqual({
      minimumUtcOffset: 5.5,
      maximumUtcOffset: 5.75,
    });
    expect(parsed.preferredUtcBand).toEqual({
      minimumUtcOffset: -1,
      maximumUtcOffset: 3.5,
    });
  });

  it('rejects evidence whose offsets do not exactly span its quote', () => {
    expect(
      workArrangementOptionSchema.safeParse({
        ...option,
        evidence: [{ ...option.evidence[0], endOffset: 101 }],
      }).success,
    ).toBe(false);
  });
});

describe('jobsForMeResponseSchema', () => {
  it('requires the three honest result groups and an applied-preference receipt', () => {
    const parsed = jobsForMeResponseSchema.parse({
      confirmedMatches: [match],
      timezoneNearMisses: [],
      needsChecking: [],
      summary: {
        confirmedMatches: 1,
        timezoneNearMisses: 0,
        needsChecking: 0,
        total: 1,
      },
      appliedPreferences: preferences,
    });

    expect(parsed.confirmedMatches[0].option?.excludedCountries).toEqual([
      'US',
    ]);
    expect(parsed.appliedPreferences.utcOffset).toBe(5.75);
  });

  it('accepts a needs-checking job with no claimed work option', () => {
    const parsed = jobsForMeResponseSchema.parse({
      confirmedMatches: [],
      timezoneNearMisses: [],
      needsChecking: [
        {
          ...match,
          option: null,
          needsChecking: [
            {
              code: 'work_arrangement_unstated',
              message: 'The employer has not stated a work arrangement.',
            },
          ],
        },
      ],
      summary: {
        confirmedMatches: 0,
        timezoneNearMisses: 0,
        needsChecking: 1,
        total: 1,
      },
      appliedPreferences: preferences,
    });

    expect(parsed.needsChecking[0].option).toBeNull();
  });

  it('rejects unreconciled summary counts and the removed flat-array shape', () => {
    expect(
      jobsForMeResponseSchema.safeParse({
        confirmedMatches: [match],
        timezoneNearMisses: [],
        needsChecking: [],
        summary: {
          confirmedMatches: 0,
          timezoneNearMisses: 0,
          needsChecking: 0,
          total: 0,
        },
        appliedPreferences: preferences,
      }).success,
    ).toBe(false);
    expect(jobsForMeResponseSchema.safeParse([match]).success).toBe(false);
  });
});
