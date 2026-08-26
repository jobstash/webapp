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

    const response = await GET();
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
    });
  });
});
