import { afterEach, describe, expect, it, vi } from 'vitest';

import { publicProfileFixture } from '../../test-fixtures';
import { fetchPublicProfile } from './fetch-public-profile';

vi.mock('@/lib/env/client', () => ({
  clientEnv: { MW_URL: 'https://middleware.test' },
}));

describe('fetchPublicProfile', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('fetches and validates the public allow-list with bounded caching', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json(publicProfileFixture));
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchPublicProfile('example labs')).resolves.toEqual(
      publicProfileFixture.data,
    );
    expect(fetchMock).toHaveBeenCalledWith(
      'https://middleware.test/profiles/example%20labs',
      { cache: 'force-cache', next: { revalidate: 3600 } },
    );
  });

  it('returns null only for a genuine 404', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 404 })),
    );
    await expect(fetchPublicProfile('missing')).resolves.toBeNull();
  });

  it('fails closed on unexpected private fields', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json({
          ...publicProfileFixture,
          data: {
            ...publicProfileFixture.data,
            contactEmail: 'private@example.com',
          },
        }),
      ),
    );

    await expect(fetchPublicProfile('example-labs')).rejects.toThrow(
      'failed validation',
    );
  });
});
