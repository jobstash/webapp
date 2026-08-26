import { FILTER_KIND } from '@/features/filters/constants';
import type { FilterConfigSchema } from '@/features/filters/schemas';

export const FILTER_GROUPS = [
  {
    id: 'role',
    label: 'Role & requirements',
    paramKeys: new Set([
      'classifications',
      'commitments',
      'seniority',
      'tags',
      'onboardIntoWeb3',
      'expertJobs',
    ]),
  },
  {
    id: 'work',
    label: 'Work setup & location',
    paramKeys: new Set([
      'workModes',
      'countries',
      'regions',
      'cities',
      'continents',
      'timezones',
      'residenceCountry',
      'utcOffset',
      'workAuthorization',
      'requiresSponsorship',
      'attendancePreference',
      'travelTolerance',
      'availability',
      'collaborationHours',
    ]),
  },
  {
    id: 'pay',
    label: 'Pay & timing',
    paramKeys: new Set([
      'publicationDate',
      'minSalaryRange',
      'maxSalaryRange',
      'paysInCrypto',
      'offersTokenAllocation',
    ]),
  },
  {
    id: 'company',
    label: 'Company & funding',
    paramKeys: new Set([
      'organizations',
      'projects',
      'ecosystems',
      'minHeadCount',
      'maxHeadCount',
      'fundingRounds',
      'investors',
      'fundingStages',
      'recentlyFunded',
    ]),
  },
  {
    id: 'developer-activity',
    label: 'Developer activity',
    paramKeys: new Set([
      'minCurrentMaintainers',
      'maxCurrentMaintainers',
      'minActiveLeads',
      'maxActiveLeads',
      'newActiveLeads',
      'steppedDownLeads',
      'movedLeads',
      'earlyLeadDepartures',
    ]),
  },
  {
    id: 'protocol',
    label: 'Protocol & market',
    paramKeys: new Set([
      'chains',
      'audits',
      'hacks',
      'token',
      'minTvl',
      'maxTvl',
      'minMonthlyVolume',
      'maxMonthlyVolume',
      'minMonthlyFees',
      'maxMonthlyFees',
      'minMonthlyRevenue',
      'maxMonthlyRevenue',
    ]),
  },
] as const;

export type FilterGroupId = (typeof FILTER_GROUPS)[number]['id'] | 'other';

export interface FilterConfigGroup {
  id: FilterGroupId;
  label: string;
  configs: FilterConfigSchema[];
}

const PRIMARY_FILTER_PARAM_KEYS = new Set([
  'classifications',
  'commitments',
  'seniority',
  'tags',
  'workModes',
  'countries',
  'publicationDate',
  'minSalaryRange',
  'maxSalaryRange',
  'minCurrentMaintainers',
  'maxCurrentMaintainers',
  'minActiveLeads',
  'maxActiveLeads',
  'newActiveLeads',
  'steppedDownLeads',
  'movedLeads',
  'earlyLeadDepartures',
]);

export const getFilterParamKeys = (config: FilterConfigSchema): string[] => {
  if (config.kind === FILTER_KIND.RANGE) {
    return [config.lowest.paramKey, config.highest.paramKey];
  }

  return [config.paramKey];
};

export const isPrimaryFilter = (config: FilterConfigSchema): boolean =>
  getFilterParamKeys(config).some((paramKey) =>
    PRIMARY_FILTER_PARAM_KEYS.has(paramKey),
  );

export const getFilterGroup = (
  config: FilterConfigSchema,
): { id: FilterGroupId; label: string } => {
  const paramKeys = getFilterParamKeys(config);
  const group = FILTER_GROUPS.find(({ paramKeys: groupParamKeys }) =>
    paramKeys.some((paramKey) => groupParamKeys.has(paramKey)),
  );

  return group ?? { id: 'other', label: 'More options' };
};

export const groupFilterConfigs = (
  configs: FilterConfigSchema[],
): FilterConfigGroup[] => {
  const grouped = new Map<FilterGroupId, FilterConfigSchema[]>();

  for (const config of configs) {
    const { id } = getFilterGroup(config);
    grouped.set(id, [...(grouped.get(id) ?? []), config]);
  }

  const orderedGroups = [
    ...FILTER_GROUPS.map(({ id, label }) => ({ id, label })),
    { id: 'other' as const, label: 'More options' },
  ];

  return orderedGroups.flatMap(({ id, label }) => {
    const groupConfigs = grouped.get(id);
    return groupConfigs?.length ? [{ id, label, configs: groupConfigs }] : [];
  });
};
