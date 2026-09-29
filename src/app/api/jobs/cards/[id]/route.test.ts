import { afterEach, describe, expect, it, vi } from 'vitest';
import { jobListItemSchema } from '@/features/jobs/schemas';
import { makeJobDto } from '@/features/jobs/test/job-fixtures';
import { GET } from './route';

vi.mock('@/lib/env/client', () => ({
  clientEnv: { MW_URL: 'https://middleware.test' },
}));

afterEach(() => vi.unstubAllGlobals());
const request = (id: string) =>
  GET(new Request('https://jobstash.xyz/api/jobs/cards/job-1'), {
    params: Promise.resolve({ id }),
  });

describe('GET /api/jobs/cards/[id]', () => {
  it('reuses the job details endpoint and returns a valid card with the correct organization link', async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json(makeJobDto()));
    vi.stubGlobal('fetch', fetch);
    const response = await request('job-1');
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    const body = jobListItemSchema.parse(await response.json());
    expect(body.id).toBe('job-1');
    expect(body.organization?.href).toBe('/o-acme~org-acme');
    expect(fetch).toHaveBeenCalledWith(
      'https://middleware.test/jobs/details/job-1',
      { cache: 'no-store' },
    );
  });

  it.each(['../admin', 'job?token=value', '', 'a'.repeat(101)])(
    'rejects invalid identifiers before calling middleware: %s',
    async (id) => {
      const fetch = vi.fn();
      vi.stubGlobal('fetch', fetch);
      const response = await request(id);
      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: 'Job not found' });
      expect(fetch).not.toHaveBeenCalled();
    },
  );

  it('preserves not found responses without forwarding upstream response bodies', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          Response.json({ error: 'Internal detail' }, { status: 404 }),
        ),
    );
    const response = await request('job-1');
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Job not found' });
  });

  it.each([
    'upstream failure',
    'wrong job',
    'malformed job',
    'network failure',
  ])('returns a safe response for %s', async (failure) => {
    const fetch = vi.fn();
    if (failure === 'network failure')
      fetch.mockRejectedValue(new Error('Database credential / private host'));
    else
      fetch.mockResolvedValue(
        failure === 'upstream failure'
          ? Response.json(
              { error: 'Database credential / private host' },
              { status: 500 },
            )
          : Response.json(
              failure === 'wrong job'
                ? makeJobDto('another-job')
                : { shortUUID: 'job-1' },
            ),
      );
    vi.stubGlobal('fetch', fetch);
    const response = await request('job-1');
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: 'Job unavailable' });
  });
});
