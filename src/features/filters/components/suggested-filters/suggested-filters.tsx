'use client';

import { FILTER_KIND } from '@/features/filters/constants';
import { type FilterConfigSchema } from '@/features/filters/schemas';

import { SuggestedFilterRange } from './suggested-filter-range';
import { SuggestedFilterRemoteSearch } from './suggested-filter-remote-search';
import { SuggestedFilterSearch } from './suggested-filter-search';
import { SuggestedFilterSelect } from './suggested-filter-select';
import { SuggestedFilterSwitch } from './suggested-filter-switch';
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
              <SuggestedFilterSwitch
                key={key}
                label={config.label}
                paramKey={config.paramKey}
              />
            );
          }
          case FILTER_KIND.CHECKBOX:
          case FILTER_KIND.RADIO: {
            return (
              <SuggestedFilterSelect
                key={key}
                label={config.label}
                paramKey={config.paramKey}
                options={config.options}
              />
            );
          }
          case FILTER_KIND.SEARCH: {
            return (
              <SuggestedFilterSearch
                key={key}
                label={config.label}
                paramKey={config.paramKey}
                options={config.options}
              />
            );
          }
          case FILTER_KIND.REMOTE_SEARCH: {
            return (
              <SuggestedFilterRemoteSearch
                key={key}
                label={config.label}
                paramKey={config.paramKey}
                options={config.options}
              />
            );
          }
          case FILTER_KIND.RANGE: {
            return <SuggestedFilterRange key={key} config={config} />;
          }
          default:
            return null;
        }
      })}
    </div>
  );
};
