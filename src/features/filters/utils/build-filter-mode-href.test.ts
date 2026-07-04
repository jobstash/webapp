import { describe, expect, it } from 'vitest';

import { buildFilterModeHref } from './build-filter-mode-href';

const REMOTE_PILLAR_BASE = {
  publicationDate: 'this-month',
  locations: 'remote',
};

describe('buildFilterModeHref', () => {
  it('adds a new filter on top of the pillar criteria', () => {
    expect(buildFilterModeHref(REMOTE_PILLAR_BASE, { tags: 'react' })).toBe(
      '/?publicationDate=this-month&locations=remote&tags=react',
    );
  });

  it('removes the publication date chip', () => {
    expect(
      buildFilterModeHref(REMOTE_PILLAR_BASE, { publicationDate: null }),
    ).toBe('/?locations=remote');
  });

  it('removes the pillar chip', () => {
    expect(buildFilterModeHref(REMOTE_PILLAR_BASE, { locations: null })).toBe(
      '/?publicationDate=this-month',
    );
  });

  it('replaces the pillar value when changed', () => {
    expect(
      buildFilterModeHref(REMOTE_PILLAR_BASE, { locations: 'hybrid' }),
    ).toBe('/?publicationDate=this-month&locations=hybrid');
  });

  it('falls back to the bare home page when everything is removed', () => {
    expect(
      buildFilterModeHref(
        { publicationDate: 'this-month' },
        { publicationDate: null },
      ),
    ).toBe('/');
  });

  it('encodes values', () => {
    expect(
      buildFilterModeHref({ publicationDate: 'this-month' }, { tags: 'c++' }),
    ).toBe('/?publicationDate=this-month&tags=c%2B%2B');
  });
});
