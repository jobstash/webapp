import 'server-only';

import { SENIORITY_MAPPING } from '@/lib/constants';

import { FILTER_KIND } from '@/features/filters/constants';
import {
  CheckboxFilterConfigSchema,
  FilterConfigSchema,
  FilterConfigSharedPropertiesSchema,
  MultiSelectFilterConfigSchema,
  RadioFilterConfigSchema,
  SelectOptionsSchema,
  SingleSelectFilterConfigSchema,
  SortFilterConfigSchema,
  SwitchFilterConfigSchema,
} from '@/features/filters/schemas';

import {
  FilterConfigDto,
  FilterConfigSharedPropertiesDto,
  MultiSelectFilterConfigDto,
  SelectOptionDto,
  SingleSelectFilterConfigDto,
} from './filter-config-dtos';

const PARAM_KEYS = {
  LOCATIONS: 'locations',
  SENIORITY: 'seniority',
  TAGS: 'tags',
  ORGANIZATIONS: 'organizations',
  PUBLICATION_DATE: 'publicationDate',
  INVESTORS: 'investors',
} as const;

type ParamKey = (typeof PARAM_KEYS)[keyof typeof PARAM_KEYS];

const LABELS = {
  ORDER: 'Order',
  ORDER_BY: 'Order By',
  WORK_MODE: 'Work Mode',
} as const;

const SUGGESTED_FILTERS = new Set<ParamKey>([
  PARAM_KEYS.LOCATIONS,
  PARAM_KEYS.SENIORITY,
  PARAM_KEYS.TAGS,
  PARAM_KEYS.ORGANIZATIONS,
  PARAM_KEYS.PUBLICATION_DATE,
  PARAM_KEYS.INVESTORS,
]);

const RADIO_FILTER_OPTION_THRESHOLD = 6;
const CHECKBOX_FILTER_OPTION_THRESHOLD = 6;
const SELECT_OPTION_THRESHOLD = 2;

const dtoToFilterConfigSharedProps = (
  dto: FilterConfigSharedPropertiesDto,
): FilterConfigSharedPropertiesSchema => {
  return {
    position: dto.position,
    label: dto.label,
    analytics: {
      id: dto.googleAnalyticsEventId,
      name: dto.googleAnalyticsEventName,
    },
  };
};

const dtoToSelectOptions = (dto: SelectOptionDto): SelectOptionsSchema => {
  return {
    value: `${dto.value}`,
    label: dto.label,
  };
};

const dtoToSwitchFilterConfig = (
  dto: SingleSelectFilterConfigDto,
): SwitchFilterConfigSchema => {
  return {
    ...dtoToFilterConfigSharedProps(dto),
    kind: FILTER_KIND.SWITCH,
    paramKey: dto.paramKey,
    label:
      dto.options.find((option) => option.value === true)?.label ?? dto.label,
  };
};

const dtoToSortFilterConfig = (
  dto: SingleSelectFilterConfigDto,
): SortFilterConfigSchema => {
  return {
    ...dtoToFilterConfigSharedProps(dto),
    kind: FILTER_KIND.SORT,
    options: dto.options.map(dtoToSelectOptions),
    paramKey: dto.paramKey,
  };
};

const dtoToRadioFilterConfig = (
  dto: SingleSelectFilterConfigDto,
): RadioFilterConfigSchema => {
  return {
    ...dtoToFilterConfigSharedProps(dto),
    kind: FILTER_KIND.RADIO,
    options: dto.options.map(dtoToSelectOptions),
    paramKey: dto.paramKey,
  };
};

const dtoToSingleSelectFilterConfig = (
  dto: SingleSelectFilterConfigDto,
): SingleSelectFilterConfigSchema => {
  return {
    ...dtoToFilterConfigSharedProps(dto),
    kind: FILTER_KIND.SINGLE_SELECT,
    options: dto.options.map(dtoToSelectOptions),
    paramKey: dto.paramKey,
  };
};

const dtoToCheckboxFilterConfig = (
  dto: MultiSelectFilterConfigDto,
): CheckboxFilterConfigSchema => {
  return {
    ...dtoToFilterConfigSharedProps(dto),
    kind: FILTER_KIND.CHECKBOX,
    options: dto.options.map(dtoToSelectOptions),
    paramKey: dto.paramKey,
  };
};

const dtoToMultiSelectFilterConfig = (
  dto: MultiSelectFilterConfigDto,
): CheckboxFilterConfigSchema | MultiSelectFilterConfigSchema => {
  return {
    ...dtoToFilterConfigSharedProps(dto),
    kind: FILTER_KIND.MULTI_SELECT,
    options: dto.options.map(dtoToSelectOptions),
    paramKey: dto.paramKey,
  };
};

const adjustFilterPosition = (dto: FilterConfigDto[string]) => {
  if (dto.label === LABELS.ORDER) dto.position = -2;
  if (dto.label === LABELS.ORDER_BY) dto.position = -1;
};

const handleSingleSelect = (
  dto: SingleSelectFilterConfigDto,
): FilterConfigSchema | null => {
  const hasNoOptions = dto.options.length < SELECT_OPTION_THRESHOLD;
  if (hasNoOptions) return null;

  if (dto.options.every((option) => typeof option.value === 'boolean')) {
    return dtoToSwitchFilterConfig(dto);
  }

  if (dto.paramKey.includes('order')) {
    return dtoToSortFilterConfig(dto);
  }

  if (dto.options.length <= RADIO_FILTER_OPTION_THRESHOLD) {
    return dtoToRadioFilterConfig(dto);
  }

  return dtoToSingleSelectFilterConfig(dto);
};

const adjustLocationLabel = (
  dto: MultiSelectFilterConfigDto,
  baseFilter: CheckboxFilterConfigSchema | MultiSelectFilterConfigSchema,
) => {
  if (dto.paramKey === PARAM_KEYS.LOCATIONS) {
    baseFilter.label = LABELS.WORK_MODE;
  }
};

const adjustSeniorityOptions = (
  dto: MultiSelectFilterConfigDto,
  baseFilter: CheckboxFilterConfigSchema | MultiSelectFilterConfigSchema,
) => {
  if (dto.paramKey === PARAM_KEYS.SENIORITY && 'options' in baseFilter) {
    baseFilter.options = Object.keys(SENIORITY_MAPPING).map((key) => ({
      label: SENIORITY_MAPPING[key as keyof typeof SENIORITY_MAPPING],
      value: key,
    }));
  }
};

const handleMultiSelect = (
  dto: MultiSelectFilterConfigDto,
): FilterConfigSchema | null => {
  const hasNoOptions = dto.options.length < SELECT_OPTION_THRESHOLD;
  if (hasNoOptions) return null;

  const isCheckbox = dto.options.length <= CHECKBOX_FILTER_OPTION_THRESHOLD;
  const baseFilter = isCheckbox
    ? dtoToCheckboxFilterConfig(dto)
    : dtoToMultiSelectFilterConfig(dto);

  adjustLocationLabel(dto, baseFilter);
  adjustSeniorityOptions(dto, baseFilter);

  return baseFilter;
};

const handleFilterConfig = (
  dto: FilterConfigDto[string],
): FilterConfigSchema | null => {
  adjustFilterPosition(dto);

  let baseFilter: FilterConfigSchema | null = null;

  switch (dto.kind) {
    case 'SINGLE_SELECT':
      baseFilter = handleSingleSelect(dto);
      break;
    case 'MULTI_SELECT':
    case 'MULTI_SELECT_WITH_SEARCH':
      baseFilter = handleMultiSelect(dto);
      break;
  }

  if (!baseFilter) return null;

  return {
    ...baseFilter,
    isSuggested: SUGGESTED_FILTERS.has(baseFilter.paramKey as ParamKey),
  };
};

export const dtoToFilterConfig = (
  dto: FilterConfigDto,
): FilterConfigSchema[] => {
  return Object.values(dto)
    .map(handleFilterConfig)
    .filter((result): result is FilterConfigSchema => result !== null)
    .sort((a, b) => a.position - b.position);
};
