import { describe, expect, it } from 'vitest';

import type { JobDetailsSchema } from '@/features/jobs/schemas';
import type { WorkArrangementV1 } from '@/features/jobs/work-arrangement';
import type { Address } from '@/lib/schemas';

import { buildJobPostingSchema } from './job-posting-schema';

const makeAddress = (overrides: Partial<Address> = {}): Address => ({
  country: 'United States',
  countryCode: 'US',
  isRemote: false,
  ...overrides,
});

const evidenceQuote = 'This role is remote in the United States.';
const makeRemoteArrangement = (
  overrides: Partial<WorkArrangementV1> = {},
): WorkArrangementV1 => ({
  classification: 'verified_remote',
  remoteOptions: [
    {
      classification: 'verified_remote',
      mode: 'remote',
      scope: 'country_list',
      includedCountries: ['US'],
      excludedCountries: [],
      includedRegions: [],
      excludedRegions: [],
      requiredUtcBand: null,
      preferredUtcBand: null,
      residencyRequirements: [],
      workAuthorizationRequirements: [],
      sponsorshipStatus: 'unstated',
      officeCity: null,
      attendanceCadence: null,
      travelRequirement: null,
      evidence: [
        {
          quote: evidenceQuote,
          startOffset: 10,
          endOffset: 10 + evidenceQuote.length,
          source: 'employer_body',
          trust: 'employer_body',
          provenance: 'job.description',
        },
      ],
      confidence: 'source_stated',
    },
  ],
  hybridOptions: [],
  onsiteOptions: [],
  ...overrides,
});

const makeJob = (
  overrides: Partial<JobDetailsSchema> = {},
): JobDetailsSchema => ({
  id: 'abc123',
  title: 'Data Analyst',
  href: '/data-analyst-example/abc123',
  hasApplyUrl: true,
  classification: null,
  summary: 'Analyze data.',
  location: 'New York, USA',
  locationType: 'ONSITE',
  addresses: [makeAddress({ locality: 'New York' })],
  infoTags: [],
  tags: [],
  organization: {
    name: 'Example',
    href: '/o-example',
    websiteUrl: 'https://example.com',
    location: null,
    logo: null,
    employeeCount: null,
    summary: null,
    description: null,
    socials: null,
    projects: [],
    fundingRounds: [],
    investors: [],
    fundingStage: null,
    recentlyFunded: false,
    teamCoverageStatus: null,
    teamSignalsAsOf: null,
    currentMaintainerCount: null,
    activeLeadCount: null,
    newActiveLeadCount: null,
    steppedDownLeadCount: null,
    movedLeadCount: null,
    earlyLeadDepartureCount: null,
    intelligenceUrl: 'https://ecosystem.vision/organizations/info/example',
  },
  availability: [],
  timestampText: 'today',
  datePosted: '2026-07-17',
  badge: null,
  description: 'Analyze product and acquisition data.',
  requirements: [],
  responsibilities: [],
  benefits: [],
  culture: null,
  hiringProcess: null,
  similarJobs: [],
  ...overrides,
});

describe('buildJobPostingSchema', () => {
  it('uses the Google remote-job model without a fake physical jobLocation', () => {
    const schema = buildJobPostingSchema(
      makeJob({
        location: 'REMOTE',
        locationType: 'REMOTE',
        addresses: [makeAddress({ isRemote: true })],
        workArrangement: makeRemoteArrangement(),
      }),
    );

    expect(schema).toMatchObject({
      identifier: {
        '@type': 'PropertyValue',
        name: 'Example',
        value: 'abc123',
      },
      jobLocationType: 'TELECOMMUTE',
      applicantLocationRequirements: [{ '@type': 'Country', name: 'US' }],
    });
    expect(schema).not.toHaveProperty('jobLocation');
  });

  it('does not mark hybrid work as TELECOMMUTE', () => {
    const schema = buildJobPostingSchema(
      makeJob({
        locationType: 'HYBRID',
        addresses: [makeAddress({ locality: 'Chicago', isRemote: true })],
      }),
    );

    expect(schema).not.toHaveProperty('jobLocationType');
    expect(schema).toHaveProperty('jobLocation');
  });

  it.each([
    [
      'unqualified remote classification',
      makeRemoteArrangement({ classification: 'remote_unqualified' }),
    ],
    [
      'aggregator-only evidence',
      makeRemoteArrangement({
        remoteOptions: [
          {
            ...makeRemoteArrangement().remoteOptions[0],
            evidence: [
              {
                quote: evidenceQuote,
                startOffset: 10,
                endOffset: 10 + evidenceQuote.length,
                source: 'aggregator',
                trust: 'aggregator',
                provenance: 'aggregator.location',
              },
            ],
            confidence: 'inherited',
          },
        ],
      }),
    ],
    ['missing WorkArrangementV1', null],
  ])('omits remote markup for %s', (_label, workArrangement) => {
    expect(
      buildJobPostingSchema(
        makeJob({
          location: 'REMOTE',
          locationType: 'REMOTE',
          addresses: [makeAddress({ isRemote: true })],
          workArrangement,
        }),
      ),
    ).toBeNull();
  });

  it('never turns a display-only office city or exclusion into eligibility', () => {
    const arrangement = makeRemoteArrangement({
      remoteOptions: [
        {
          ...makeRemoteArrangement().remoteOptions[0],
          scope: 'global',
          includedCountries: ['US'],
          excludedCountries: ['US'],
          officeCity: 'Lisbon',
        },
      ],
    });

    expect(
      buildJobPostingSchema(
        makeJob({
          location: 'Lisbon (Remote)',
          locationType: 'REMOTE',
          addresses: [makeAddress({ isRemote: true, locality: 'Lisbon' })],
          workArrangement: arrangement,
        }),
      ),
    ).toBeNull();
  });

  it('emits the most specific truthful physical address available', () => {
    const schema = buildJobPostingSchema(
      makeJob({
        addresses: [makeAddress({ locality: 'Detroit', region: 'Michigan' })],
      }),
    );

    expect(schema).toMatchObject({
      jobLocation: [
        {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'US',
            addressLocality: 'Detroit',
            addressRegion: 'Michigan',
          },
        },
      ],
    });
  });

  it.each([
    [
      'remote job without applicant countries',
      {
        locationType: 'REMOTE',
        addresses: null,
        workArrangement: makeRemoteArrangement({
          remoteOptions: [
            {
              ...makeRemoteArrangement().remoteOptions[0],
              includedCountries: [],
            },
          ],
        }),
      },
    ],
    [
      'physical job without a country',
      { locationType: 'ONSITE', addresses: null },
    ],
    ['job without an apply URL', { hasApplyUrl: false }],
  ])('omits ineligible markup for a %s', (_label, overrides) => {
    expect(buildJobPostingSchema(makeJob(overrides))).toBeNull();
  });
});
