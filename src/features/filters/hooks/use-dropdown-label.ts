import { useSearchParams } from 'next/navigation';

import { capitalizeSlug } from '@/lib/utils';
import {
  FilterConfigSchema,
  SelectOptionsSchema,
} from '@/features/filters/schemas';
import { checkIsRemoteFilter } from '@/features/filters/utils';

const DEFAULT_LABEL = 'Select';

const getLabelForRemoteFilter = (values: string[]) => {
  if (values.length > 1) return `${values.length} items`;
  return capitalizeSlug(values[0]);
};

const getLabelForLocalFilter = (
  values: string[],
  options: SelectOptionsSchema[],
) => {
  const validValues = values.filter((value) =>
    options.some((opt) => opt.value === value),
  );

  if (validValues.length === 0) return DEFAULT_LABEL;
  if (validValues.length > 1) return `${validValues.length} items`;

  const option = options.find((opt) => opt.value === validValues[0]);
  return option?.label ?? validValues[0];
};

export const useDropdownLabel = (config: FilterConfigSchema) => {
  const searchParams = useSearchParams();
  const paramValue = searchParams.get(config.paramKey);
  if (!paramValue) return DEFAULT_LABEL;

  const values = paramValue.split(',');

  if (!('options' in config)) return paramValue;

  return checkIsRemoteFilter(config)
    ? getLabelForRemoteFilter(values)
    : getLabelForLocalFilter(values, config.options);
};
