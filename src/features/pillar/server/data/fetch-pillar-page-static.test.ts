import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchPillarPageStatic } from './fetch-pillar-page-static';

const { cachedResults } = vi.hoisted(() => ({
  cachedResults: new Map<string, unknown>(),
}));

vi.mock('next/cache', () => ({
  unstable_cache:
    <Args extends unknown[], Result>(
      callback: (...args: Args) => Promise<Result>,
    ) =>
    async (...args: Args) => {
      const key = JSON.stringify(args);
      if (cachedResults.has(key)) {
        return cachedResults.get(key) as Result;
      }

      const result = await callback(...args);
      cachedResults.set(key, result);
      return result;
    },
}));

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
  project: {
    id: 'project-1',
    name: 'React Protocol',
    normalizedName: 'react-protocol',
  },
};

const stubFetchResponse = (init: {
  ok?: boolean;
  status?: number;
  body?: unknown;
}) => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: async () => init.body,
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

afterEach(() => {
  cachedResults.clear();
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

  it('retains the authoritative noindex decision for a canonical empty FDE pillar', async () => {
    stubFetchResponse({
      body: {
        success: true,
        message: 'Retrieved pillar page data',
        data: {
          title: 'Forward Deployed Engineer Jobs',
          description: 'Find forward deployed engineer jobs',
          jobs: [],
          indexing: 'noindex',
          hasEligibleOpenJobs: false,
          organization: null,
        },
      },
    });

    await expect(
      fetchPillarPageStatic('cl-forward-deployed-engineer'),
    ).resolves.toMatchObject({
      jobs: [],
      indexing: 'noindex',
      hasEligibleOpenJobs: false,
    });
  });

  it('caches a validated pillar result', async () => {
    const fetchMock = stubFetchResponse({
      body: {
        success: true,
        message: 'Retrieved pillar page data',
        data: {
          title: 'Cached Jobs',
          description: 'A cached pillar',
          jobs: [validJob],
          organization: null,
        },
      },
    });

    await fetchPillarPageStatic('t-cached');
    await fetchPillarPageStatic('t-cached');

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does not cache a transient MW failure', async () => {
    const fetchMock = stubFetchResponse({
      body: { success: false, message: 'Database temporarily unavailable' },
    });

    await expect(fetchPillarPageStatic('t-retry')).rejects.toThrow('t-retry');
    await expect(fetchPillarPageStatic('t-retry')).rejects.toThrow('t-retry');

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
