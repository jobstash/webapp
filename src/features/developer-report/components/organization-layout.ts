type AtlasPoint = {
  organizationKey: string;
  layoutX: number;
  layoutY: number;
};

type RankedPosition = {
  x: number;
  y: number;
};

const rankedAxis = (
  points: AtlasPoint[],
  valueOf: (point: AtlasPoint) => number,
) => {
  const sorted = [...points].sort(
    (left, right) =>
      valueOf(left) - valueOf(right) ||
      left.organizationKey.localeCompare(right.organizationKey),
  );
  const positions = new Map<string, number>();

  for (let start = 0; start < sorted.length; ) {
    let end = start + 1;
    while (
      end < sorted.length &&
      valueOf(sorted[end]) === valueOf(sorted[start])
    ) {
      end += 1;
    }

    const averageRank = (start + end - 1) / 2;
    const normalized =
      sorted.length === 1 ? 0 : (averageRank / (sorted.length - 1)) * 2 - 1;
    for (let index = start; index < end; index += 1) {
      positions.set(sorted[index].organizationKey, normalized);
    }
    start = end;
  }

  return positions;
};

/**
 * Spreads the atlas across both chart axes without changing its topology.
 *
 * The graph layout occasionally contains distant outliers. Plotting its raw
 * coordinates compresses the remaining organizations into a small knot. A
 * rank transform preserves the ordering on each axis, is deterministic, and
 * prevents a handful of outliers from consuming most of the canvas.
 */
export const buildStableAtlasPositions = (points: AtlasPoint[]) => {
  const xPositions = rankedAxis(points, (point) => point.layoutX);
  const yPositions = rankedAxis(points, (point) => point.layoutY);

  return new Map<string, RankedPosition>(
    points.map((point) => [
      point.organizationKey,
      {
        x: xPositions.get(point.organizationKey) ?? 0,
        y: yPositions.get(point.organizationKey) ?? 0,
      },
    ]),
  );
};
