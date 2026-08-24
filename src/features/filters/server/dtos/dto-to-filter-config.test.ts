import { describe, expect, it } from 'vitest';

import { dtoToFilterConfig } from './dto-to-filter-config';

const locationConfig = (position: number, label: string, paramKey: string) => ({
  position,
  label,
  show: true,
  googleAnalyticsEventId: null,
  googleAnalyticsEventName: `filter_${paramKey}`,
  kind: 'MULTI_SELECT_WITH_SEARCH' as const,
  paramKey,
  options: [
    {
      label: `${label} A`,
      value: `${paramKey}-a`,
      aliases: [`place:test:${paramKey}:a`],
    },
    {
      label: `${label} B`,
      value: `${paramKey}-b`,
      aliases: [`place:test:${paramKey}:b`],
    },
  ],
});

describe('dtoToFilterConfig location facets', () => {
  it('keeps each geographic dimension distinct and suggested', () => {
    const result = dtoToFilterConfig({
      countries: locationConfig(1, 'Country', 'countries'),
      regions: locationConfig(2, 'Region', 'regions'),
      cities: locationConfig(3, 'City', 'cities'),
      continents: locationConfig(4, 'Continent', 'continents'),
      timezones: locationConfig(5, 'Timezone', 'timezones'),
    });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'Country',
          paramKey: 'countries',
          isSuggested: true,
        }),
        expect.objectContaining({
          label: 'Region',
          paramKey: 'regions',
          isSuggested: true,
        }),
        expect.objectContaining({
          label: 'City',
          paramKey: 'cities',
          isSuggested: true,
        }),
        expect.objectContaining({
          label: 'Continent',
          paramKey: 'continents',
          isSuggested: true,
        }),
        expect.objectContaining({
          label: 'Timezone',
          paramKey: 'timezones',
          isSuggested: true,
        }),
      ]),
    );
    for (const config of result) {
      if (!('options' in config)) continue;
      for (const option of config.options) {
        expect(option.value).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
        expect(option.value).not.toMatch(/[:/]/);
        expect(option.aliases?.[0]).toMatch(/^place:/);
      }
    }
  });

  it('keeps a collaboration-hours filter when one UTC bucket is available', () => {
    const [result] = dtoToFilterConfig({
      collaborationHours: {
        ...locationConfig(
          1,
          'Team Collaboration Hours (UTC)',
          'collaborationHours',
        ),
        options: [{ label: '08:00 UTC', value: 'utc-08' }],
      },
    });

    expect(result).toEqual(
      expect.objectContaining({
        paramKey: 'collaborationHours',
        isSuggested: true,
        options: [{ label: '08:00 UTC', value: 'utc-08' }],
      }),
    );
  });

  it('shows broad Remote and 100% Remote when the API has no work-mode facets yet', () => {
    const [result] = dtoToFilterConfig({
      workModes: {
        position: 1,
        label: 'Work Mode',
        show: true,
        googleAnalyticsEventId: null,
        googleAnalyticsEventName: 'filter_joblist_work_modes',
        kind: 'MULTI_SELECT_WITH_SEARCH',
        paramKey: 'workModes',
        options: [],
      },
    });

    expect(result).toEqual(
      expect.objectContaining({
        label: 'Work Mode',
        paramKey: 'workModes',
        options: [
          { label: 'Remote', value: 'remote' },
          { label: '100% Remote', value: 'fully-remote' },
          { label: 'Onsite', value: 'onsite' },
          { label: 'Hybrid', value: 'hybrid' },
        ],
      }),
    );
  });

  it('keeps other API work modes after the two remote options', () => {
    const [result] = dtoToFilterConfig({
      workModes: {
        position: 1,
        label: 'Work Mode',
        show: true,
        googleAnalyticsEventId: null,
        googleAnalyticsEventName: 'filter_joblist_work_modes',
        kind: 'MULTI_SELECT_WITH_SEARCH',
        paramKey: 'workModes',
        options: [
          { label: 'Onsite', value: 'onsite' },
          { label: 'Hybrid', value: 'hybrid' },
        ],
      },
    });

    expect(result).toEqual(
      expect.objectContaining({
        options: [
          { label: 'Remote', value: 'remote' },
          { label: '100% Remote', value: 'fully-remote' },
          { label: 'Onsite', value: 'onsite' },
          { label: 'Hybrid', value: 'hybrid' },
        ],
      }),
    );
  });
});
