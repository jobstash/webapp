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

describe('dtoToJobListItem — org socials and projects', () => {
  it('normalizes handles to absolute urls and keeps full urls', () => {
    const item = dtoToJobListItem(
      makeJobListItemDto({
        organization: makeOrganizationDto({
          twitter: '@bitrefill',
          telegram: 'bitrefill',
          discord: 'https://discord.com/invite/bitrefill',
          github: 'bitrefill',
          docs: 'https://docs.bitrefill.com',
        }),
      }),
    );

    expect(item.organization?.socials).toEqual({
      twitter: 'https://x.com/bitrefill',
      telegram: 'https://t.me/bitrefill',
      discord: 'https://discord.com/invite/bitrefill',
      github: 'https://github.com/bitrefill',
      docs: 'https://docs.bitrefill.com',
    });
  });

  it('returns null socials when no channel is present', () => {
    const item = dtoToJobListItem(makeJobListItemDto());
    expect(item.organization?.socials).toBeNull();
  });

  it('maps projects and drops nameless entries', () => {
    const item = dtoToJobListItem(
      makeJobListItemDto({
        organization: makeOrganizationDto({
          projects: [
            {
              id: 'p1',
              name: 'MetaMask',
              logo: null,
              logoUrl: null,
              website: 'https://metamask.io',
              category: 'Wallet',
            },
            {
              id: 'p2',
              name: null,
              logo: null,
              logoUrl: null,
              website: null,
              category: null,
            },
          ],
        }),
      }),
    );

    expect(item.organization?.projects).toHaveLength(1);
    expect(item.organization?.projects[0]).toMatchObject({
      id: 'p1',
      name: 'MetaMask',
      website: 'https://metamask.io',
      category: 'Wallet',
    });
  });

  it('defaults to empty projects when the endpoint omits them', () => {
    const item = dtoToJobListItem(makeJobListItemDto());
    expect(item.organization?.projects).toEqual([]);
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

describe('dtoToJobListItem — publishedTimestampIsVerified', () => {
  const getPostedTag = (dto: JobListItemDto) =>
    dtoToJobListItem(dto).infoTags.find((tag) => tag.iconKey === 'posted');

  it('marks the posted info tag verified when the flag is true', () => {
    const tag = getPostedTag(
      makeJobListItemDto({ publishedTimestampIsVerified: true }),
    );
    expect(tag?.verified).toBe(true);
  });

  it.each([
    ['false', false],
    ['absent', undefined],
  ])('omits verified when the flag is %s', (_label, value) => {
    const tag = getPostedTag(
      makeJobListItemDto({ publishedTimestampIsVerified: value }),
    );
    expect(tag).toBeDefined();
    expect(tag).not.toHaveProperty('verified');
  });
});

describe('dtoToJobListItem — structured locations', () => {
  it('keeps the source work mode and resolves uppercase remote locations', () => {
    const item = dtoToJobListItem(
      makeJobListItemDto({ location: 'REMOTE', locationType: 'REMOTE' }),
    );

    expect(item.location).toBe('REMOTE');
    expect(item.locationType).toBe('REMOTE');
    expect(item.addresses?.length).toBeGreaterThan(0);
    expect(item.addresses?.every((address) => address.isRemote)).toBe(true);
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
