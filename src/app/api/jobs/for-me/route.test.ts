import { afterEach, describe, expect, it, vi } from 'vitest';

import { GET } from './route';

vi.mock('@/lib/env/client', () => ({
  clientEnv: { MW_URL: 'https://middleware.test' },
}));

vi.mock('@/lib/server/session', () => ({
  getSession: vi.fn().mockResolvedValue({ apiToken: 'session-token' }),
}));

const upstreamJob = {
  id: 'job-42',
  title: 'Protocol Engineer',
  url: 'https://example.test/apply',
  shortUUID: 'abc123',
  timestamp: 1_700_000_000_000,
  summary: 'Build protocol infrastructure.',
  seniority: null,
  salary: null,
  minimumSalary: null,
  maximumSalary: null,
  location: 'Remote',
  locationType: 'remote',
  commitment: null,
  paysInCrypto: null,
  offersTokenAllocation: null,
  salaryCurrency: null,
  classification: 'engineering',
  tags: [],
  access: 'public',
  featured: false,
  featureStartDate: null,
  featureEndDate: null,
  onboardIntoWeb3: false,
  organization: null,
  project: {
    id: 'project-42',
    name: 'Protocol Labs',
    normalizedName: 'protocol-labs',
  },
};

const upstreamMatch = {
  job: upstreamJob,
  option: {
    classification: 'verified_remote',
    mode: 'remote',
    scope: 'global',
    includedCountries: [],
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
    confidence: 'source_stated',
    evidence: [
      {
        quote: 'This role is remote.',
        startOffset: 0,
        endOffset: 20,
        source: 'employer_body',
        trust: 'employer_body',
        provenance: 'job.description',
      },
    ],
  },
  explanation: 'The role explicitly supports remote work worldwide.',
  needsChecking: [],
  optionalSignals: [],
};

const upstreamResponse = {
  confirmedMatches: [upstreamMatch],
  timezoneNearMisses: [],
  needsChecking: [],
  summary: {
    confirmedMatches: 1,
    timezoneNearMisses: 0,
    needsChecking: 0,
    total: 1,
  },
  appliedPreferences: {
    workModes: ['remote'],
    residenceCountry: 'NL',
    utcOffset: 1,
    workAuthorization: 'EU',
    requiresSponsorship: false,
    attendancePreference: 'Remote only',
    travelTolerance: 'Once per quarter',
  },
};

describe('GET /api/jobs/for-me', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('maps the middleware job DTO into the rendered job-card contract', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json(upstreamResponse));
    vi.stubGlobal('fetch', fetchMock);

    const response = await GET();
    const body = (await response.json()) as {
      confirmedMatches: Array<{ job: Record<string, unknown> }>;
    };

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://middleware.test/jobs/for-me',
      expect.objectContaining({
        headers: { Authorization: 'Bearer session-token' },
      }),
    );
    expect(body.confirmedMatches[0]?.job).toEqual(
      expect.objectContaining({
        id: 'abc123',
        href: '/protocol-engineer-protocol-labs/abc123',
        hasApplyUrl: true,
        timestampText: expect.any(String),
      }),
    );
  });

  it('fails closed when the middleware job DTO is incomplete', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json({
          ...upstreamResponse,
          confirmedMatches: [
            {
              ...upstreamMatch,
              job: { shortUUID: 'missing-required-fields' },
            },
          ],
        }),
      ),
    );

    const response = await GET();

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      error: 'The service returned an invalid response',
    });
  });
});
