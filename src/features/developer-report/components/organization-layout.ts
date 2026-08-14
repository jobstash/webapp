type AtlasPoint = {
  organizationKey: string;
  layoutX: number | null;
  layoutY: number | null;
};

type StablePosition = { x: number; y: number };

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
 * on a -1000..1000 plane. Never rank or reflow the selected subset: filtering
 * must change bubble size/visibility without moving an organization.
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
