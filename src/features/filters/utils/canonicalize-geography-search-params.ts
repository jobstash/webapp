import type { FilterConfigSchema } from '@/features/filters/schemas';

export const GEOGRAPHY_PARAM_KEYS = [
  'availability',
  'cities',
  'regions',
  'countries',
  'continents',
  'timezones',
] as const;

const LEGACY_GEOGRAPHY_VALUE = /^(?:place|raw|tz):/i;

export const hasLegacyGeographySearchParams = (
  searchParams: Record<string, string>,
): boolean =>
  GEOGRAPHY_PARAM_KEYS.some((paramKey) =>
    (searchParams[paramKey]?.split(',') ?? []).some((value) =>
      LEGACY_GEOGRAPHY_VALUE.test(value.trim()),
    ),
  );

export const canonicalizeGeographySearchParams = (
  searchParams: Record<string, string>,
  configs: FilterConfigSchema[],
): { searchParams: Record<string, string>; changed: boolean } => {
  const canonical = { ...searchParams };
  let changed = false;

  for (const paramKey of GEOGRAPHY_PARAM_KEYS) {
    const current = searchParams[paramKey];
    if (!current) continue;

    const config = configs.find(
      (candidate) => 'options' in candidate && candidate.paramKey === paramKey,
    );
    if (!config || !('options' in config)) continue;

    const valueByAlias = new Map(
      config.options.flatMap((option) =>
        (option.aliases ?? []).map((alias) => [alias, option.value] as const),
      ),
    );
    const values = current
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    const next = [
      ...new Set(values.map((value) => valueByAlias.get(value) ?? value)),
    ].join(',');

    if (next !== current) {
      canonical[paramKey] = next;
      changed = true;
    }
  }

  return { searchParams: canonical, changed };
};
