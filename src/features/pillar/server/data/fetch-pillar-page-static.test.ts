import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchPillarPageStatic } from './fetch-pillar-page-static';

const validJob = {
  id: 'job-1',
  title: 'React Developer',
  url: 'https://example.com/job/1',
  shortUUID: 'abc123',
  timestamp: Date.now(),
  summary: 'A job',
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
  organization: null,
};

const stubFetchResponse = (init: {
  ok?: boolean;
  status?: number;
  body?: unknown;
}) => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: init.ok ?? true,
      status: init.status ?? 200,
      json: async () => init.body,
    }),
  );
};

afterEach(() => {
  vi.unstubAllGlobals();
});

// Pillar pages are SEO landing pages: a transient MW failure must throw
// (uncached 500, retried on next hit) rather than resolve to a cacheable
// 404 that deindexes the page. Only a genuine absence (success:true with
// data:null) may produce null → notFound().
describe('fetchPillarPageStatic', () => {
  it('throws on non-OK responses', async () => {
    stubFetchResponse({ ok: false, status: 502 });
    await expect(fetchPillarPageStatic('t-react')).rejects.toThrow('502');
  });

  it('throws when fetch rejects (network failure)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNRESET')));
    await expect(fetchPillarPageStatic('t-react')).rejects.toThrow(
      'ECONNRESET',
    );
  });

  it('throws when MW reports failure (success:false)', async () => {
    stubFetchResponse({
      body: { success: false, message: 'Error retrieving pillar page data' },
    });
    await expect(fetchPillarPageStatic('t-react')).rejects.toThrow('t-react');
  });

  it('throws when the payload fails validation', async () => {
    stubFetchResponse({
      body: { success: true, message: 'ok', data: { title: 42 } },
    });
    await expect(fetchPillarPageStatic('t-react')).rejects.toThrow(
      'failed validation',
    );
  });

  it('returns null when the pillar genuinely has no data', async () => {
    stubFetchResponse({
      body: {
        success: true,
        message: 'No jobs found for this pillar',
        data: null,
      },
    });
    await expect(fetchPillarPageStatic('t-react')).resolves.toBeNull();
  });

  it('returns the mapped page for a valid payload', async () => {
    stubFetchResponse({
      body: {
        success: true,
        message: 'Retrieved pillar page data',
        data: {
          title: 'React Jobs',
          description: 'Find react jobs',
          jobs: [validJob],
          organization: null,
        },
      },
    });
    const result = await fetchPillarPageStatic('t-react');
    expect(result?.title).toBe('React Jobs');
    expect(result?.jobs).toHaveLength(1);
  });
});
