import 'server-only';

import type { PillarFilterContext } from '@/features/pillar/schemas';

interface CleanPillarSearchParamsResult {
  needsRedirect: boolean;
  cleanParams: URLSearchParams;
}

/**
 * Checks if searchParams contains redundant pillar values and returns clean params.
 * Example: slug="t-typescript", params="tags=typescript,react" -> cleanParams="tags=react", needsRedirect=true
 */
export const getCleanPillarSearchParams = (
  searchParams: Record<string, string | string[] | undefined>,
  pillarContext: PillarFilterContext,
): CleanPillarSearchParamsResult => {
  const cleanParams = new URLSearchParams();
  let needsRedirect = false;

  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined) continue;

    // Normalize value to string
    const valueStr = Array.isArray(value) ? value.join(',') : value;

    if (key === pillarContext.paramKey) {
      // Split by comma to handle multiple values
      const values = valueStr.split(',').map((v) => v.trim());
      const filteredValues = values.filter((v) => v !== pillarContext.value);

      if (filteredValues.length < values.length) {
        // Pillar value was found and removed
        needsRedirect = true;

        if (filteredValues.length > 0) {
          // Keep remaining values
          cleanParams.set(key, filteredValues.join(','));
        }
        // If no remaining values, param is omitted entirely
      } else {
        // No pillar value found, keep original
        cleanParams.set(key, valueStr);
      }
    } else {
      // Keep non-matching params as-is
      cleanParams.set(key, valueStr);
    }
  }

  return { needsRedirect, cleanParams };
};
