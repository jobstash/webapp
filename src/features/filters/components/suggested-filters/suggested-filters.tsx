'use client';

import type { PillarFilterContext } from '@/features/pillar/schemas';
import { FILTER_KIND } from '@/features/filters/constants';
import { groupFilterConfigs } from '@/features/filters/filter-groups';
import { type FilterConfigSchema } from '@/features/filters/schemas';

import { SuggestedFilterRange } from './suggested-filter-range';
import { SuggestedFilterRemoteSearch } from './suggested-filter-remote-search';
import { SuggestedFilterSearch } from './suggested-filter-search';
import { SuggestedFilterSelect } from './suggested-filter-select';
import { SuggestedFilterSwitch } from './suggested-filter-switch';
import { useSuggestedFilters } from './use-suggested-filters';

interface Props {
  configs: FilterConfigSchema[];
  pillarContext?: PillarFilterContext | null;
}

export const SuggestedFilters = ({ configs, pillarContext }: Props) => {
  const suggestedFilters = useSuggestedFilters(configs);
  if (suggestedFilters.length === 0) return null;

  const groups = groupFilterConfigs(suggestedFilters);

  return (
    <div className='space-y-4'>
      {groups.map((group) => (
        <section key={group.id} aria-label={group.label}>
          <h3 className='mb-2 text-[11px] font-medium tracking-wide text-muted-foreground'>
            {group.label}
          </h3>
          <div className='flex flex-wrap gap-2'>
            {group.configs.map((config) => (
              <SuggestedFilter
                key={config.label}
                config={config}
                pillarContext={pillarContext}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

const SuggestedFilter = ({
  config,
  pillarContext,
}: {
  config: FilterConfigSchema;
  pillarContext?: PillarFilterContext | null;
}) => {
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
      const excludeValues =
        pillarContext?.paramKey === config.paramKey
          ? [pillarContext.value]
          : undefined;
      return (
        <SuggestedFilterRemoteSearch
          key={key}
          label={config.label}
          paramKey={config.paramKey}
          options={config.options}
          excludeValues={excludeValues}
        />
      );
    }
    case FILTER_KIND.RANGE: {
      return <SuggestedFilterRange key={key} config={config} />;
    }
    default:
      return null;
  }
};
