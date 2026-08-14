import { describe, expect, it } from 'vitest';

import { buildStableAtlasPositions } from './organization-layout';

describe('buildStableAtlasPositions', () => {
  it('uses the full plotting range even when the graph has distant outliers', () => {
    const positions = buildStableAtlasPositions([
      { organizationKey: 'a', layoutX: 0, layoutY: 0 },
      { organizationKey: 'b', layoutX: 1, layoutY: 10 },
      { organizationKey: 'c', layoutX: 2, layoutY: 20 },
      { organizationKey: 'outlier', layoutX: 10_000, layoutY: 30 },
    ]);

    expect(positions.get('a')).toEqual({ x: -1, y: -1 });
    expect(positions.get('b')?.x).toBeCloseTo(-1 / 3);
    expect(positions.get('c')?.x).toBeCloseTo(1 / 3);
    expect(positions.get('outlier')).toEqual({ x: 1, y: 1 });
  });

  it('gives tied coordinates the same deterministic rank', () => {
    const input = [
      { organizationKey: 'z', layoutX: 4, layoutY: 1 },
      { organizationKey: 'a', layoutX: 4, layoutY: 3 },
      { organizationKey: 'm', layoutX: 8, layoutY: 2 },
    ];

    const first = buildStableAtlasPositions(input);
    const second = buildStableAtlasPositions([...input].reverse());

    expect(first).toEqual(second);
    expect(first.get('a')?.x).toBe(first.get('z')?.x);
    expect(first.get('m')?.x).toBe(1);
  });
});
