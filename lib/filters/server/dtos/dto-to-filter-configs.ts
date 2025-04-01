import 'server-only';

import { FILTER_KIND } from '@/lib/filters/core/constants';
import {
  CheckboxFilterConfigSchema,
  FilterConfigItemSchema,
  FilterConfigSchema,
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
  };
};

const BASIC_FILTERS_POSITION = {
  locations: 1,
  seniority: 2,
  tags: 3,
};
type BasicFilterConfigKeys = keyof typeof BASIC_FILTERS_POSITION;

const isBasicFilterParam = (paramKey: string): boolean =>
  paramKey in BASIC_FILTERS_POSITION;

type ProcessedFilter = {
  filter: FilterConfigItemSchema;
  isBasic: boolean;
};

const processFilter = (filterDto: FilterConfigDto[string]): ProcessedFilter | null => {
  if (filterDto.kind === FILTER_KIND.RANGE) {
    const filter = dtoToRangeFilterConfig(filterDto);
    return {
      filter,
      isBasic: false, // We won't show range filters as basic (for now)
    };
  }

  if (filterDto.kind === FILTER_KIND.SINGLE_SELECT) {
    const filter = dtoToSingleSelectFilterConfig(filterDto);
    const isBasic = isBasicFilterParam(filterDto.paramKey);

    if (isBasic) {
      filter.position =
        BASIC_FILTERS_POSITION[filterDto.paramKey as BasicFilterConfigKeys];
    }

    return {
      filter,
      isBasic,
    };
  }

  if (
    filterDto.kind === FILTER_KIND.MULTI_SELECT ||
    filterDto.kind === FILTER_KIND.MULTI_SELECT_WITH_SEARCH
  ) {
    const filter = dtoToMultiSelectFilterConfig(filterDto);
    const isBasic = isBasicFilterParam(filterDto.paramKey);

    if (isBasic) {
      filter.position =
        BASIC_FILTERS_POSITION[filterDto.paramKey as BasicFilterConfigKeys];
    }

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

    return {
      filter,
      isBasic,
    };
  }

  return null;
};

export const dtoToFilterConfig = (dto: FilterConfigDto): FilterConfigSchema => {
  const basicFilters: FilterConfigItemSchema[] = [];
  const advancedFilters: FilterConfigItemSchema[] = [];

  Object.values(dto)
    .map(processFilter)
    .filter((result): result is ProcessedFilter => result !== null)
    .sort((a, b) => a.filter.position - b.filter.position)
    .forEach(({ filter, isBasic }) => {
      const group = isBasic ? basicFilters : advancedFilters;
      group.push(filter);
    });

  return {
    basicFilters,
    advancedFilters,
  };
};
