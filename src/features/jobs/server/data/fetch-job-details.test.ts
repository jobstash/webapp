import { afterEach, describe, expect, it, vi } from 'vitest';

import payload from '@/features/jobs/test/loopscale-null-timestamp.json';
import { buildJobPostingSchema } from '@/features/jobs/components/job-posting-schema';
import { extractOgImageData } from '@/features/jobs/lib/og-image-utils';
import { fetchJobDetails } from './fetch-job-details';

vi.mock('@/lib/env/client', () => ({
  clientEnv: {
    MW_URL: 'http://middleware.test',
    FRONTEND_URL: 'http://webapp.test',
  },
}));
vi.mock('./fetch-similar-jobs', () => ({ fetchSimilarJobs: async () => [] }));

afterEach(() => vi.unstubAllGlobals());

describe('fetchJobDetails publication-date contract', () => {
  it('keeps the real null-date job reachable without invented date claims', async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json(payload));
    vi.stubGlobal('fetch', fetch);
    const job = await fetchJobDetails({ id: 'BEvbH3' });
    expect(fetch).toHaveBeenCalledWith(
      'http://middleware.test/jobs/details/BEvbH3',
      { cache: 'no-store' },
    );
    expect(job).not.toBeNull();
    expect(job).toMatchObject({
      id: 'BEvbH3',
      title: payload.title,
      timestampText: null,
      datePosted: null,
    });
    expect(job!.infoTags.some((tag) => tag.iconKey === 'posted')).toBe(false);
    expect(extractOgImageData(job!).timestampText).toBeNull();
    expect(buildJobPostingSchema(job!)).toBeNull();
  });

  it('retains the known date and structured data when the API supplies it', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          Response.json({ ...payload, timestamp: Date.UTC(2026, 10, 6) }),
        ),
    );
    const job = await fetchJobDetails({ id: 'BEvbH3' });
    expect(job!.datePosted).toBe('2026-11-06');
    expect(job!.infoTags.some((tag) => tag.iconKey === 'posted')).toBe(true);
    expect(buildJobPostingSchema(job!)).toHaveProperty(
      'datePosted',
      '2026-11-06',
    );
  });

  it.each([undefined, 'unknown'])(
    'continues rejecting malformed or missing timestamps: %s',
    async (timestamp) => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(Response.json({ ...payload, timestamp })),
      );
      const log = vi.spyOn(console, 'error').mockImplementation(() => {});
      try {
        expect(await fetchJobDetails({ id: 'BEvbH3' })).toBeNull();
        expect(log).toHaveBeenCalled();
      } finally {
        log.mockRestore();
      }
    },
  );
});
