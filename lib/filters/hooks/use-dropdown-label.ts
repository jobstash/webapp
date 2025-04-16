import { useSearchParams } from 'next/navigation';

import { FILTER_KIND } from '@/lib/filters/core/constants';
import { FilterConfigSchema, SelectOptionsSchema } from '@/lib/filters/core/schemas';

import { capitalizeSlug } from '@/lib/shared/utils/capitalize';
import { checkIsRemoteFilter } from '@/lib/filters/utils/check-is-remote-filter';

const DEFAULT_LABEL = 'Select';

const getLabelForRemoteFilter = (values: string[]) => {
  if (values.length > 1) return `${values.length} items`;
  return capitalizeSlug(values[0]);
};

const getLabelForLocalFilter = (values: string[], options: SelectOptionsSchema[]) => {
  const validValues = values.filter((value) =>
    options.some((opt) => opt.value === value),
  );

  if (validValues.length > 1) return `${validValues.length} items`;

  const valueToUse = validValues[0] || values[0];
  const option = options.find((opt) => opt.value === valueToUse);
  return option?.label || valueToUse;
};

export const useDropdownLabel = (config: FilterConfigSchema) => {
  const searchParams = useSearchParams();
  const paramValue = searchParams.get(config.paramKey);
  if (!paramValue) return DEFAULT_LABEL;

  const values = paramValue.split(',');
  const isRemoteFilter = checkIsRemoteFilter(config);

  if (
    config.kind === FILTER_KIND.CHECKBOX ||
    config.kind === FILTER_KIND.SINGLE_SELECT ||
    config.kind === FILTER_KIND.MULTI_SELECT ||
    config.kind === FILTER_KIND.RADIO
  ) {
    return isRemoteFilter
      ? getLabelForRemoteFilter(values)
      : getLabelForLocalFilter(values, config.options);
  }

  return paramValue;
};
