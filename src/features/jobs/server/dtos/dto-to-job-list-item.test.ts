import { describe, expect, it } from 'vitest';

import { dtoToJobListItem } from './dto-to-job-list-item';
import { jobListItemDto, type JobListItemDto } from './job-list-item.dto';

const makeOrganizationDto = (
  overrides: Partial<NonNullable<JobListItemDto['organization']>> = {},
): NonNullable<JobListItemDto['organization']> => ({
  id: 'org-id',
  name: 'Bitrefill',
  normalizedName: 'bitrefill',
  orgId: '345',
  website: 'https://bitrefill.com',
  summary: 'Live on crypto.',
  location: 'Stockholm, Sweden',
  description: 'Bitrefill sells gift cards for crypto.',
  logoUrl: null,
  headcountEstimate: 74,
  fundingRounds: [],
  investors: [],
  ...overrides,
});

const makeJobListItemDto = (
  overrides: Partial<JobListItemDto> = {},
): JobListItemDto => ({
  id: 'job-id',
  title: 'Senior Frontend Engineer',
  url: 'https://example.com/apply',
  shortUUID: 'abc123',
  timestamp: Date.UTC(2026, 0, 15),
  summary: 'Build things.',
  seniority: null,
  salary: null,
  minimumSalary: null,
  maximumSalary: null,
  location: null,
  locationType: null,
  commitment: null,
  paysInCrypto: null,
  offersTokenAllocation: null,
  salaryCurrency: null,
  classification: null,
  tags: [],
  access: 'public',
  featured: false,
  featureStartDate: null,
  featureEndDate: null,
  onboardIntoWeb3: false,
  organization: makeOrganizationDto(),
  ...overrides,
});

describe('dtoToJobListItem — organization summary/description', () => {
  it('passes org summary and description through to the schema', () => {
    const item = dtoToJobListItem(makeJobListItemDto());

    expect(item.organization?.summary).toBe('Live on crypto.');
    expect(item.organization?.description).toBe(
      'Bitrefill sells gift cards for crypto.',
    );
  });

  it('normalizes missing org summary/description to null', () => {
    const item = dtoToJobListItem(
      makeJobListItemDto({
        organization: makeOrganizationDto({
          summary: undefined,
          description: null,
        }),
      }),
    );

    expect(item.organization?.summary).toBeNull();
    expect(item.organization?.description).toBeNull();
  });
});

describe('jobListItemDto — org summary/description tolerance', () => {
  it.each([
    ['empty strings', { summary: '', description: '' }],
    ['nulls', { summary: null, description: null }],
    ['omitted', { summary: undefined, description: undefined }],
  ])('parses successfully with %s', (_label, orgOverrides) => {
    const raw = makeJobListItemDto({
      organization: makeOrganizationDto(orgOverrides),
    });

    const parsed = jobListItemDto.safeParse(raw);

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.organization?.summary ?? null).toBeNull();
      expect(parsed.data.organization?.description ?? null).toBeNull();
    }
  });
});

describe('dtoToJobListItem — existing behavior smoke', () => {
  it('builds the slugified href from title and org name', () => {
    const item = dtoToJobListItem(makeJobListItemDto());
    expect(item.href).toBe('/senior-frontend-engineer-bitrefill/abc123');
  });

  it('derives a fallback title and summary when both are null', () => {
    const item = dtoToJobListItem(
      makeJobListItemDto({ title: null, summary: null }),
    );

    expect(item.title).toBe('Role at Bitrefill');
    expect(item.summary).toBe('Bitrefill is looking for a Role at Bitrefill.');
  });
});
