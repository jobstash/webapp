import { FILTER_KIND, FilterKind } from '@/lib/filters/core/constants';
import { FilterConfigSchema } from '@/lib/filters/core/schemas';

const dropdownFilterKinds = new Set<FilterKind>([
  FILTER_KIND.CHECKBOX,
  FILTER_KIND.SINGLE_SELECT,
  FILTER_KIND.MULTI_SELECT,
  FILTER_KIND.RADIO,
]);

export const checkFilterHasDropdown = (config: FilterConfigSchema) => {
  return dropdownFilterKinds.has(config.kind);
};
