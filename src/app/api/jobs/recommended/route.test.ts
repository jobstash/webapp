import { afterEach, describe, expect, it, vi } from 'vitest';

import { GET } from './route';

vi.mock('@/lib/env/client', () => ({
  clientEnv: { MW_URL: 'https://middleware.test' },
}));

vi.mock('@/lib/server/session', () => ({
  getSession: vi.fn().mockResolvedValue({ apiToken: 'session-token' }),
}));

const validJob = {
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

describe('GET /api/jobs/recommended', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('maps valid jobs and skips a bad row', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json({
          jobs: [
            { job: { shortUUID: 'bad' }, reason: 'Bad' },
            { job: validJob, reason: 'Engineering' },
          ],
          total: 2,
        }),
      ),
    );

    const response = await GET(
      new Request('https://jobstash.xyz/api/jobs/recommended'),
    );
    const body = (await response.json()) as {
      jobs: Array<{ job: { id: string }; reason: string }>;
      total: number;
    };

    expect(response.status).toBe(200);
    expect(body).toEqual({
      jobs: [
        {
          job: expect.objectContaining({ id: 'abc123' }),
          reason: 'Engineering',
        },
      ],
      total: 1,
      rankingVersion: 'legacy',
      page: 1,
      hasMore: false,
    });
  });
  it('preserves the upstream ranking version for recommendation attribution', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json({
          jobs: [{ job: validJob, reason: 'Matches several requirements' }],
          rankingVersion: 'sentences-v1',
        }),
      ),
    );
    expect(
      await (
        await GET(new Request('https://jobstash.xyz/api/jobs/recommended'))
      ).json(),
    ).toMatchObject({
      rankingVersion: 'sentences-v1',
      total: 1,
    });
  });
  it('forwards the requested page and preserves the total match count', async () => {
    const fetch = vi.fn().mockResolvedValue(
      Response.json({
        jobs: [{ job: validJob, reason: 'Engineering' }],
        total: 61,
        page: 2,
        hasMore: true,
      }),
    );
    vi.stubGlobal('fetch', fetch);
    const response = await GET(
      new Request('https://jobstash.xyz/api/jobs/recommended?page=2'),
    );
    expect(fetch).toHaveBeenCalledWith(
      'https://middleware.test/jobs/recommended?page=2',
      expect.objectContaining({ cache: 'no-store' }),
    );
    expect(await response.json()).toMatchObject({
      total: 61,
      page: 2,
      hasMore: true,
    });
  });
});
