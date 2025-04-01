import { FILTER_KIND } from '@/lib/filters/core/constants';
import { FilterConfigItemSchema } from '@/lib/filters/core/schemas';

import { CheckboxFilter } from './checkbox-filter';
import { MultiSelectFilter } from './multi-select-filter';
import { RadioFilter } from './radio-filter';
import { RangeFilter } from './range-filter';
import { SingleSelectFilter } from './single-select-filter';
import { SwitchFilter } from './switch-filter';

interface Props {
  config: FilterConfigItemSchema;
}

export const FilterConfigItemMapper = ({ config }: Props) => {
  if (config.kind === FILTER_KIND.RANGE) {
    return <RangeFilter config={config} />;
  }

  if (config.kind === FILTER_KIND.SINGLE_SELECT) {
    return <SingleSelectFilter config={config} />;
  }

  if (config.kind === FILTER_KIND.MULTI_SELECT) {
    return <MultiSelectFilter config={config} />;
  }

  if (config.kind === FILTER_KIND.RADIO) {
    return <RadioFilter config={config} />;
  }

  if (config.kind === FILTER_KIND.CHECKBOX) {
    return <CheckboxFilter config={config} />;
  }

  if (config.kind === FILTER_KIND.SWITCH) {
    return <SwitchFilter config={config} />;
  }

  return null;
};
