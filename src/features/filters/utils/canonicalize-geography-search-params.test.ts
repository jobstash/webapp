import { describe, expect, it } from 'vitest';

import type { FilterConfigSchema } from '@/features/filters/schemas';

import {
  canonicalizeGeographySearchParams,
  hasLegacyGeographySearchParams,
} from './canonicalize-geography-search-params';

const configs = [
  {
    position: 1,
    label: 'City',
    analytics: { id: null, name: null },
    kind: 'SEARCH',
    paramKey: 'cities',
    options: [
      {
        label: 'Berlin',
        value: 'berlin',
        aliases: ['place:geonames:2950159'],
      },
    ],
  },
  {
    position: 2,
    label: 'Timezone',
    analytics: { id: null, name: null },
    kind: 'SEARCH',
    paramKey: 'timezones',
    options: [
      {
        label: 'Europe/Berlin',
        value: 'europe-berlin',
        aliases: ['tz:Europe/Berlin'],
      },
    ],
  },
] satisfies FilterConfigSchema[];

describe('canonicalizeGeographySearchParams', () => {
  it('rewrites provider IDs to SEO slugs without touching other filters', () => {
    expect(
      canonicalizeGeographySearchParams(
        {
          cities: 'place:geonames:2950159,berlin',
          timezones: 'tz:Europe/Berlin',
          classifications: 'engineering-management',
        },
        configs,
      ),
    ).toEqual({
      changed: true,
      searchParams: {
        cities: 'berlin',
        timezones: 'europe-berlin',
        classifications: 'engineering-management',
      },
    });
  });

  it('leaves canonical slugs unchanged', () => {
    const searchParams = { cities: 'berlin' };
    expect(canonicalizeGeographySearchParams(searchParams, configs)).toEqual({
      changed: false,
      searchParams,
    });
    expect(hasLegacyGeographySearchParams(searchParams)).toBe(false);
  });

  it('detects every legacy internal geography namespace', () => {
    expect(
      hasLegacyGeographySearchParams({
        availability: 'raw:city:berlin',
      }),
    ).toBe(true);
    expect(
      hasLegacyGeographySearchParams({
        countries: 'place:geonames:2921044',
      }),
    ).toBe(true);
    expect(
      hasLegacyGeographySearchParams({ timezones: 'tz:Europe/Berlin' }),
    ).toBe(true);
  });
});
