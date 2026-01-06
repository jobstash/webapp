import { FILTER_KIND } from '@/features/filters/constants';
import { type FilterConfigSchema } from '@/features/filters/schemas';
import { checkIsRemoteFilter } from '@/features/filters/utils';

import { ActiveCheckboxFilter } from './active-checkbox-filter';
import { ActiveSearchFilter } from './active-search-filter';
import { ActiveRadioFilter } from './active-radio-filter';
import { ActiveSelectFilter } from './active-select-filter';
import { ActiveRemoteSearchFilter } from './active-remote-search-filter';

interface Props {
  config: FilterConfigSchema;
}

export const ActiveFilterDropdown = ({ config }: Props) => {
  if (config.kind === FILTER_KIND.CHECKBOX) {
    return <ActiveCheckboxFilter config={config} />;
  }

  if (config.kind === FILTER_KIND.RADIO) {
    return <ActiveRadioFilter config={config} />;
  }

  if (config.kind === FILTER_KIND.SINGLE_SELECT) {
    return <ActiveSelectFilter config={config} />;
  }

  if (config.kind === FILTER_KIND.MULTI_SELECT) {
    const isRemote = checkIsRemoteFilter(config);
    if (isRemote) {
      return <ActiveRemoteSearchFilter config={config} />;
    }
    return <ActiveSearchFilter config={config} />;
  }

  return null;
};
