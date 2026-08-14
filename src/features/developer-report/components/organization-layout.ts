type AtlasPoint = {
  organizationKey: string;
  layoutX: number | null;
  layoutY: number | null;
};

type StablePosition = { x: number; y: number };

type AxisViewport = { min: number; max: number };

export type AtlasViewport = {
  x: AxisViewport;
  y: AxisViewport;
};

const hashUnit = (value: string, seed: number) => {
  let hash = seed >>> 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 16_777_619);
  }
  return (hash >>> 0) / 0xffff_ffff;
};

const fallbackPosition = (organizationKey: string): StablePosition => {
  const angle = hashUnit(organizationKey, 2_166_136_261) * Math.PI * 2;
  const radius =
    0.2 + Math.sqrt(hashUnit(organizationKey, 2_246_822_519)) * 0.75;
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
};

/**
 * The backend layout is calculated once from full-history organization edges
 * on a -1000..1000 plane. Never rank or reflow the selected subset. The chart
 * can reframe that stable layout, but it must not invent new point positions.
 */
export const buildStableAtlasPositions = (points: AtlasPoint[]) =>
  new Map<string, StablePosition>(
    points.map((point) => [
      point.organizationKey,
      point.layoutX === null || point.layoutY === null
        ? fallbackPosition(point.organizationKey)
        : {
            x: Math.max(-1, Math.min(1, point.layoutX / 1000)),
            y: Math.max(-1, Math.min(1, point.layoutY / 1000)),
          },
    ]),
  );

const viewportFor = (values: number[]): AxisViewport => {
  if (values.length === 0) return { min: -1.08, max: 1.08 };

  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const center = (minimum + maximum) / 2;
  const contentSpan = Math.max(0.32, maximum - minimum);
  const paddedSpan = contentSpan * 1.36;

  return {
    min: center - paddedSpan / 2,
    max: center + paddedSpan / 2,
  };
};

/**
 * Keep every organization's graph position stable while fitting the selected
 * set to the available canvas. This changes only the camera, not the layout.
 */
export const buildAtlasViewport = (
  positions: Iterable<StablePosition>,
): AtlasViewport => {
  const points = [...positions];
  return {
    x: viewportFor(points.map((point) => point.x)),
    y: viewportFor(points.map((point) => point.y)),
  };
};
