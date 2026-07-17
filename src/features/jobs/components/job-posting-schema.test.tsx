import { describe, expect, it } from 'vitest';

import type { JobDetailsSchema } from '@/features/jobs/schemas';
import type { Address } from '@/lib/schemas';

import { buildJobPostingSchema } from './job-posting-schema';

const makeAddress = (overrides: Partial<Address> = {}): Address => ({
  country: 'United States',
  countryCode: 'US',
  isRemote: false,
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
  },
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
      }),
    );

    expect(schema).toMatchObject({
      identifier: {
        '@type': 'PropertyValue',
        name: 'Example',
        value: 'abc123',
      },
      jobLocationType: 'TELECOMMUTE',
      applicantLocationRequirements: [
        { '@type': 'Country', name: 'United States' },
      ],
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
      { locationType: 'REMOTE', addresses: null },
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
