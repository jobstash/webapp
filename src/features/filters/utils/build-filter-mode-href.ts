/**
 * Composes the home-page URL used when a pillar page transitions into real
 * filter mode: the pillar's implied criteria plus the user's change.
 * A `null` change removes that param.
 */
export const buildFilterModeHref = (
  baseParams: Record<string, string>,
  changes: Record<string, string | null>,
): string => {
  const params = new URLSearchParams(baseParams);

  for (const [key, value] of Object.entries(changes)) {
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }

  const queryString = params.toString();
  return queryString ? `/?${queryString}` : '/';
};
