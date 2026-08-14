import { describe, expect, it } from 'vitest';

import {
  buildAtlasViewport,
  buildStableAtlasPositions,
} from './organization-layout';

describe('buildStableAtlasPositions', () => {
  it('preserves graph ordering and is stable across input order', () => {
    const forward = buildStableAtlasPositions([
      { organizationKey: 'a', layoutX: -500, layoutY: 250 },
      { organizationKey: 'b', layoutX: 750, layoutY: -1000 },
    ]);
    const reversed = buildStableAtlasPositions([
      { organizationKey: 'b', layoutX: 750, layoutY: -1000 },
      { organizationKey: 'a', layoutX: -500, layoutY: 250 },
    ]);

    expect(forward.get('a')).toEqual({ x: -0.88, y: 0.88 });
    expect(forward.get('b')).toEqual({ x: 0.88, y: -0.88 });
    expect(reversed).toEqual(forward);
  });

  it('keeps malformed outliers bounded', () => {
    const positions = buildStableAtlasPositions([
      { organizationKey: 'valid', layoutX: 100, layoutY: -200 },
      { organizationKey: 'outlier', layoutX: 10_000, layoutY: -10_000 },
    ]);

    expect(positions.get('valid')).toEqual({ x: -0.88, y: 0.88 });
    expect(positions.get('outlier')).toEqual({ x: 0.88, y: -0.88 });
  });

  it('gives organizations without a materialized layout a stable fallback', () => {
    const full = buildStableAtlasPositions([
      { organizationKey: 'missing', layoutX: null, layoutY: null },
      { organizationKey: 'other', layoutX: null, layoutY: null },
    ]);
    const reversed = buildStableAtlasPositions([
      { organizationKey: 'other', layoutX: null, layoutY: null },
      { organizationKey: 'missing', layoutX: null, layoutY: null },
    ]);

    expect(reversed).toEqual(full);
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

    expect(positions.get('a')).toEqual({ x: -0.88, y: -0.88 });
    expect(positions.get('b')).toEqual({ x: 0, y: 0 });
    expect(positions.get('c')).toEqual({ x: 0.88, y: 0.88 });
    expect(viewport.x.min).toBeCloseTo(-1.1);
    expect(viewport.x.max).toBeCloseTo(1.1);
    expect(viewport.y.min).toBeCloseTo(-1.1);
    expect(viewport.y.max).toBeCloseTo(1.1);
  });
});
