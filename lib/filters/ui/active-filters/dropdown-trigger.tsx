'use client';

import { FILTER_KIND } from '@/lib/filters/core/constants';
import { FilterConfigSchema } from '@/lib/filters/core/schemas';

import { checkIsRemoteFilter } from '@/lib/filters/utils/check-is-remote-filter';

import { CheckboxDropdown } from './checkbox-dropdown';
import { MultiselectDropdown } from './multiselect-dropdown';
import { RadioDropdown } from './radio-dropdown';
import { RemoteSearchDropdown } from './remote-search-dropdown';
import { SingleSelectDropdown } from './singleselect-dropdown';

interface Props {
  config: FilterConfigSchema;
}

export const DropdownTrigger = ({ config }: Props) => {
  if (config.kind === FILTER_KIND.CHECKBOX) {
    return <CheckboxDropdown config={config} />;
  }

  if (config.kind === FILTER_KIND.RADIO) {
    return <RadioDropdown config={config} />;
  }

  if (config.kind === FILTER_KIND.SINGLE_SELECT) {
    return <SingleSelectDropdown config={config} />;
  }

  if (config.kind === FILTER_KIND.MULTI_SELECT) {
    const isRemote = checkIsRemoteFilter(config);
    if (isRemote) {
      return <RemoteSearchDropdown config={config} />;
    }
    return <MultiselectDropdown config={config} />;
  }

  return null;
};
