import { describe, expect, it } from 'vitest';

import {
  buildAtlasViewport,
  buildStableAtlasPositions,
} from './organization-layout';

describe('buildStableAtlasPositions', () => {
  it('uses full-history backend coordinates without subset re-ranking', () => {
    const full = buildStableAtlasPositions([
      { organizationKey: 'a', layoutX: -500, layoutY: 250 },
      { organizationKey: 'b', layoutX: 750, layoutY: -1000 },
    ]);
    const filtered = buildStableAtlasPositions([
      { organizationKey: 'a', layoutX: -500, layoutY: 250 },
    ]);

    expect(full.get('a')).toEqual({ x: -0.5, y: 0.25 });
    expect(filtered.get('a')).toEqual(full.get('a'));
    expect(full.get('b')).toEqual({ x: 0.75, y: -1 });
  });

  it('bounds malformed outliers without moving valid coordinates', () => {
    const positions = buildStableAtlasPositions([
      { organizationKey: 'valid', layoutX: 100, layoutY: -200 },
      { organizationKey: 'outlier', layoutX: 10_000, layoutY: -10_000 },
    ]);

    expect(positions.get('valid')).toEqual({ x: 0.1, y: -0.2 });
    expect(positions.get('outlier')).toEqual({ x: 1, y: -1 });
  });

  it('gives organizations without a materialized layout a stable fallback', () => {
    const full = buildStableAtlasPositions([
      { organizationKey: 'missing', layoutX: null, layoutY: null },
      { organizationKey: 'other', layoutX: null, layoutY: null },
    ]);
    const filtered = buildStableAtlasPositions([
      { organizationKey: 'missing', layoutX: null, layoutY: null },
    ]);

    expect(filtered.get('missing')).toEqual(full.get('missing'));
    expect(full.get('missing')).not.toEqual(full.get('other'));
    expect(Math.abs(full.get('missing')?.x ?? 2)).toBeLessThanOrEqual(1);
    expect(Math.abs(full.get('missing')?.y ?? 2)).toBeLessThanOrEqual(1);
  });

  it('fits a clustered selection to the chart without moving its points', () => {
    const positions = buildStableAtlasPositions([
      { organizationKey: 'a', layoutX: -559, layoutY: -321 },
      { organizationKey: 'b', layoutX: -200, layoutY: 56 },
      { organizationKey: 'c', layoutX: -90, layoutY: 304 },
    ]);
    const viewport = buildAtlasViewport(positions.values());

    expect(positions.get('b')).toEqual({ x: -0.2, y: 0.056 });
    expect(viewport.x.min).toBeLessThan(-0.559);
    expect(viewport.x.max).toBeGreaterThan(-0.09);
    expect(viewport.y.min).toBeLessThan(-0.321);
    expect(viewport.y.max).toBeGreaterThan(0.304);
    expect(viewport.x.max - viewport.x.min).toBeLessThan(1);
    expect(viewport.y.max - viewport.y.min).toBeLessThan(1);
  });
});
