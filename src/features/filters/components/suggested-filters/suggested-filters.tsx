'use client';

import { FILTER_KIND } from '@/features/filters/constants';
import { type FilterConfigSchema } from '@/features/filters/schemas';
import { checkIsRemoteFilter } from '@/features/filters/utils';

import { SuggestedSwitchFilter } from './suggested-switch-filter';
import { SuggestedSelectFilter } from './suggested-select-filter';
import { SuggestedSearchFilter } from './suggested-search-filter';
import { SuggestedRemoteSearchFilter } from './suggested-remote-search-filter';
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
            return (
              <SuggestedSwitchFilter
                key={key}
                label={config.label}
                paramKey={config.paramKey}
              />
            );
          }
          case FILTER_KIND.CHECKBOX:
          case FILTER_KIND.RADIO:
          case FILTER_KIND.SINGLE_SELECT: {
            return <SuggestedSelectFilter key={key} config={config} />;
          }
          case FILTER_KIND.MULTI_SELECT: {
            const isRemote = checkIsRemoteFilter(config);
            if (isRemote)
              return (
                <SuggestedRemoteSearchFilter
                  key={key}
                  label={config.label}
                  paramKey={config.paramKey}
                  options={config.options}
                />
              );
            return (
              <SuggestedSearchFilter
                key={key}
                label={config.label}
                paramKey={config.paramKey}
                options={config.options}
              />
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
};
