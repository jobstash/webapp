import { FILTER_KIND } from '@/lib/filters/core/constants';
import { FilterConfigItemSchema } from '@/lib/filters/core/schemas';

export const getActiveFilterValueLabel = (
  config: FilterConfigItemSchema,
  initValue: string | null,
): string => {
  if (!initValue) return '';

  switch (config.kind) {
    case FILTER_KIND.CHECKBOX:
    case FILTER_KIND.SINGLE_SELECT:
    case FILTER_KIND.MULTI_SELECT:
    case FILTER_KIND.RADIO:
      // Handle comma-separated values for select-like filters
      const values = initValue.split(',');

      // Filter out invalid values
      const validValues = values.filter((value) =>
        config.options.some((opt) => opt.value === value),
      );

      // Return count label if multiple valid values
      if (validValues.length > 1) {
        return `${validValues.length} items`;
      }

      // Use the single valid value or the original value if filtering didn't change anything
      const valueToUse = validValues.length === 1 ? validValues[0] : initValue;
      const option = config.options.find((opt) => opt.value === valueToUse);
      return option?.label || valueToUse;

    default:
      return initValue;
  }
};
