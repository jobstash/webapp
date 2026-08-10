import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/env/client', () => ({
  clientEnv: {
    MW_URL: 'https://mw.test',
  },
}));

import { fetchCanonicalPillarSlug } from './fetch-canonical-pillar-slug';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchCanonicalPillarSlug', () => {
  it('does not cache location identity resolution', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ canonicalSlug: 'africa' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchCanonicalPillarSlug('l-africa')).resolves.toBeNull();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://mw.test/search/pillar/location/resolve?value=africa',
      { cache: 'no-store' },
    );
  });

  it('redirects a genuine location alias to the current canonical slug', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ canonicalSlug: 'africa' }),
      }),
    );

    await expect(fetchCanonicalPillarSlug('l-afrique')).resolves.toBe(
      'l-africa',
    );
  });
});
