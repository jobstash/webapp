'use client';

import { FILTER_KIND } from '@/lib/filters/core/constants';
import { FilterConfigSchema } from '@/lib/filters/core/schemas';

import { checkIsRemoteFilter } from '@/lib/filters/utils/check-is-remote-filter';

import { RemoteSearchDropdown } from './remote-search-dropdown';
import { SearchDropdown } from './search-dropdown';
import { SingleselectDropdown } from './singleselect-dropdown';
import { SwitchItem } from './switch-item';
import { useSuggestedFilters } from './use-suggested-filters';

interface Props {
  configs: FilterConfigSchema[];
}

export const SuggestedFilters = ({ configs }: Props) => {
  const suggestedFilters = useSuggestedFilters(configs);

  if (suggestedFilters.length === 0) return null;

  return (
    <div className='flex flex-wrap gap-2'>
      {suggestedFilters.map((config) => {
        const key = config.label;

        switch (config.kind) {
          case FILTER_KIND.SWITCH: {
            return <SwitchItem key={key} config={config} />;
          }

          case FILTER_KIND.CHECKBOX:
          case FILTER_KIND.RADIO:
          case FILTER_KIND.SINGLE_SELECT: {
            return <SingleselectDropdown key={key} config={config} />;
          }

          case FILTER_KIND.MULTI_SELECT: {
            const isRemote = checkIsRemoteFilter(config);
            if (isRemote) return <RemoteSearchDropdown key={key} config={config} />;
            return <SearchDropdown key={key} config={config} />;
          }

          default: {
            return null;
          }
        }
      })}
    </div>
  );
};
