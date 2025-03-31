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

const BASIC_FILTER_PARAM_KEYS = ['publicationDate', 'locations', 'tags'];

const isBasicFilterParam = (paramKey: string): boolean =>
  BASIC_FILTER_PARAM_KEYS.includes(paramKey);

type ProcessedFilter = {
  filter: FilterConfigItemSchema;
  isBasic: boolean;
};

const processFilter = (filterDto: FilterConfigDto[string]): ProcessedFilter | null => {
  if (filterDto.kind === FILTER_KIND.RANGE) {
    const minParamKey = filterDto.value.lowest.paramKey;
    const maxParamKey = filterDto.value.highest.paramKey;
    return {
      filter: dtoToRangeFilterConfig(filterDto),
      isBasic: isBasicFilterParam(minParamKey) || isBasicFilterParam(maxParamKey),
    };
  }

  if (filterDto.kind === FILTER_KIND.SINGLE_SELECT) {
    return {
      filter: dtoToSingleSelectFilterConfig(filterDto),
      isBasic: isBasicFilterParam(filterDto.paramKey),
    };
  }

  if (
    filterDto.kind === FILTER_KIND.MULTI_SELECT ||
    filterDto.kind === FILTER_KIND.MULTI_SELECT_WITH_SEARCH
  ) {
    const filter = dtoToMultiSelectFilterConfig(filterDto);
    if (filterDto.paramKey === 'locations') {
      filter.label = 'Work Mode';
    }
    return {
      filter,
      isBasic: isBasicFilterParam(filterDto.paramKey),
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
    .forEach(({ filter, isBasic }) => {
      const group = isBasic ? basicFilters : advancedFilters;
      group.push(filter);
    });

  return {
    basicFilters,
    advancedFilters,
  };
};
