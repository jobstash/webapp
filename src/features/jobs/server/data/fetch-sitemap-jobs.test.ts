import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/env/client', () => ({
  clientEnv: {
    MW_URL: 'https://mw.test',
    FRONTEND_URL: 'https://fe.test',
  },
}));

import { toSitemapEntries } from './fetch-sitemap-jobs';

const job = (overrides: Record<string, unknown> = {}) => ({
  shortUUID: 'abc123',
  title: 'Product Manager',
  organizationName: 'Harmony',
  timestamp: Date.UTC(2026, 0, 15),
  ...overrides,
});

describe('toSitemapEntries', () => {
  it('keeps valid timestamps as lastModified', () => {
    const [entry] = toSitemapEntries([job()]);
    expect(entry.href).toBe('/product-manager-harmony/abc123');
    expect(entry.lastModified).toEqual(new Date(Date.UTC(2026, 0, 15)));
  });

  it.each([
    ['epoch 0', 0],
    ['pre-2000 artifact', Date.UTC(1999, 11, 31)],
    ['null', null],
  ])('omits lastModified for %s instead of emitting a bogus date', (_l, ts) => {
    const [entry] = toSitemapEntries([job({ timestamp: ts })]);
    expect(entry.href).toBe('/product-manager-harmony/abc123');
    expect(entry.lastModified).toBeUndefined();
  });

  it('dedupes identical urls, keeping the newest date', () => {
    const entries = toSitemapEntries([
      job({ timestamp: Date.UTC(2026, 0, 1) }),
      job({ timestamp: Date.UTC(2026, 2, 1) }),
      job({ timestamp: 0 }),
    ]);

    expect(entries).toHaveLength(1);
    expect(entries[0].lastModified).toEqual(new Date(Date.UTC(2026, 2, 1)));
  });

  it('a dateless duplicate does not clobber a dated entry', () => {
    const entries = toSitemapEntries([
      job({ timestamp: 0 }),
      job({ timestamp: Date.UTC(2026, 1, 1) }),
    ]);

    expect(entries).toHaveLength(1);
    expect(entries[0].lastModified).toEqual(new Date(Date.UTC(2026, 1, 1)));
  });
});
