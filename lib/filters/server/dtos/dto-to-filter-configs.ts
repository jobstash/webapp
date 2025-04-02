import 'server-only';

import { FILTER_KIND } from '@/lib/filters/core/constants';
import {
  CheckboxFilterConfigSchema,
  FilterConfigItemSchema,
  FilterConfigSharedPropertiesSchema,
  MultiSelectFilterConfigSchema,
  RadioFilterConfigSchema,
  RangeFilterConfigSchema,
  SelectOptionsSchema,
  SingleSelectFilterConfigSchema,
  SwitchFilterConfigSchema,
} from '@/lib/filters/core/schemas';
import { jobSeniorityMapping } from '@/lib/jobs/core/constants';

import {
  FilterConfigDto,
  FilterConfigSharedPropertiesDto,
  MultiSelectFilterConfigDto,
  RangeFilterConfigDto,
  SelectOptionDto,
  SingleSelectFilterConfigDto,
} from '@/lib/filters/server/dtos/filter-config-dtos';

const SUGGESTED_FILTERS = new Set([
  'locations',
  'seniority',
  'tags',
  'organizations',
  'publicationDate',
  'investors',
]);

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

const dtoToRangeFilterConfig = (dto: RangeFilterConfigDto): RangeFilterConfigSchema => {
  return {
    ...dtoToFilterConfigSharedProps(dto),
    kind: FILTER_KIND.RANGE,
    min: dto.value.lowest,
    max: dto.value.highest,
    unit: dto.prefix,
  };
};

const dtoToSelectOptions = (dto: SelectOptionDto): SelectOptionsSchema => {
  return {
    value: `${dto.value}`, // Coerce boolean value to string
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
    isSuggested: SUGGESTED_FILTERS.has(dto.paramKey),
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
    isSuggested: SUGGESTED_FILTERS.has(dto.paramKey),
  };
};

const SWITCH_FILTER_OPTION_COUNT = 2;
const RADIO_FILTER_OPTION_THRESHOLD = 6;

const dtoToSingleSelectFilterConfig = (
  dto: SingleSelectFilterConfigDto,
):
  | SwitchFilterConfigSchema
  | RadioFilterConfigSchema
  | SingleSelectFilterConfigSchema => {
  if (dto.options.length === SWITCH_FILTER_OPTION_COUNT) {
    return dtoToSwitchFilterConfig(dto);
  }

  if (dto.options.length <= RADIO_FILTER_OPTION_THRESHOLD) {
    return dtoToRadioFilterConfig(dto);
  }

  return {
    ...dtoToFilterConfigSharedProps(dto),
    kind: FILTER_KIND.SINGLE_SELECT,
    options: dto.options.map(dtoToSelectOptions),
    paramKey: dto.paramKey,
    isSuggested: SUGGESTED_FILTERS.has(dto.paramKey),
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
    isSuggested: SUGGESTED_FILTERS.has(dto.paramKey),
  };
};

const CHECKBOX_FILTER_OPTION_THRESHOLD = 6;

const dtoToMultiSelectFilterConfig = (
  dto: MultiSelectFilterConfigDto,
): CheckboxFilterConfigSchema | MultiSelectFilterConfigSchema => {
  if (dto.options.length <= CHECKBOX_FILTER_OPTION_THRESHOLD) {
    return dtoToCheckboxFilterConfig(dto);
  }

  return {
    ...dtoToFilterConfigSharedProps(dto),
    kind: FILTER_KIND.MULTI_SELECT,
    options: dto.options.map(dtoToSelectOptions),
    paramKey: dto.paramKey,
    isSuggested: SUGGESTED_FILTERS.has(dto.paramKey),
  };
};

const SELECT_OPTION_THRESHOLD = 2;

const processFilter = (
  filterDto: FilterConfigDto[string],
): FilterConfigItemSchema | null => {
  if (filterDto.kind === FILTER_KIND.RANGE) {
    return dtoToRangeFilterConfig(filterDto);
  }

  if (filterDto.kind === FILTER_KIND.SINGLE_SELECT) {
    const hasNoOptions = filterDto.options.length < SELECT_OPTION_THRESHOLD;
    if (hasNoOptions) return null;

    return dtoToSingleSelectFilterConfig(filterDto);
  }

  if (
    filterDto.kind === FILTER_KIND.MULTI_SELECT ||
    filterDto.kind === FILTER_KIND.MULTI_SELECT_WITH_SEARCH
  ) {
    const hasNoOptions = filterDto.options.length < SELECT_OPTION_THRESHOLD;
    if (hasNoOptions) return null;

    const filter = dtoToMultiSelectFilterConfig(filterDto);

    // Manual relabel locations
    // TODO: Move this op to mw
    if (filterDto.paramKey === 'locations') {
      filter.label = 'Work Mode';
    }

    // Manual seniority label mapping
    if (filterDto.paramKey === 'seniority') {
      const mappedOptions = Object.keys(jobSeniorityMapping).map((key) => ({
        label: jobSeniorityMapping[key as keyof typeof jobSeniorityMapping],
        value: key,
      }));
      filter.options = mappedOptions;
    }

    return filter;
  }

  return null;
};

export const dtoToFilterConfig = (dto: FilterConfigDto): FilterConfigItemSchema[] => {
  return Object.values(dto)
    .map(processFilter)
    .filter((result): result is FilterConfigItemSchema => result !== null)
    .sort((a, b) => a.position - b.position);
};
