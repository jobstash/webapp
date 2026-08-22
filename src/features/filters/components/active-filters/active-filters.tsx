'use client';

import type { PillarFilterContext } from '@/features/pillar/schemas';
import {
  FILTER_KIND,
  PILLAR_FALLBACK_CHIP_LABELS,
} from '@/features/filters/constants';
import {
  useActiveFilters,
  usePillarFilterMode,
} from '@/features/filters/hooks';
import { type FilterConfigSchema } from '@/features/filters/schemas';

import { ActiveFilterCheckbox } from './active-filter-checkbox';
import { ActiveFilterRadio } from './active-filter-radio';
import { ActiveFilterRange } from './active-filter-range';
import { ActiveFiltersSearch } from './active-filter-search';
import { ActiveFilterSwitch } from './active-filter-switch';
import { ActiveFilterRemoteSearch } from './active-filter-remote-search';

interface Props {
  configs: FilterConfigSchema[];
  pillarContext?: PillarFilterContext | null;
}

export const ActiveFilters = ({ configs, pillarContext }: Props) => {
  const activeFilters = useActiveFilters(configs);
  const pillarMode = usePillarFilterMode();

  // Pillar params with no matching config (e.g. expertJobs until MW ships
  // its filter) still get a chip so the pillar's criteria stay visible and
  // removable. Real configs take precedence.
  const fallbackKeys = pillarMode
    ? Object.keys(pillarMode.baseParams).filter(
        (key) =>
          !configs.some(
            (config) => 'paramKey' in config && config.paramKey === key,
          ),
      )
    : [];

  if (activeFilters.length === 0 && fallbackKeys.length === 0) return null;

  return (
    <div className='flex flex-wrap gap-2'>
      {fallbackKeys.map((key) => (
        <ActiveFilterSwitch
          key={key}
          label={PILLAR_FALLBACK_CHIP_LABELS[key] ?? key}
          paramKey={key}
        />
      ))}
      {activeFilters.map((config) => {
        const key = config.label;

        switch (config.kind) {
          case FILTER_KIND.SWITCH: {
            return (
              <ActiveFilterSwitch
                key={key}
                label={config.label}
                paramKey={config.paramKey}
              />
            );
          }
          case FILTER_KIND.CHECKBOX: {
            return (
              <ActiveFilterCheckbox
                key={key}
                label={config.label}
                paramKey={config.paramKey}
                options={config.options}
              />
            );
          }
          case FILTER_KIND.RADIO: {
            return (
              <ActiveFilterRadio
                key={key}
                label={config.label}
                paramKey={config.paramKey}
                options={config.options}
              />
            );
          }
          case FILTER_KIND.SEARCH: {
            return (
              <ActiveFiltersSearch
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
              <ActiveFilterRemoteSearch
                key={key}
                label={config.label}
                paramKey={config.paramKey}
                options={config.options}
                excludeValues={excludeValues}
              />
            );
          }
          case FILTER_KIND.RANGE: {
            return <ActiveFilterRange key={key} config={config} />;
          }
          default:
            return null;
        }
      })}
    </div>
  );
};
