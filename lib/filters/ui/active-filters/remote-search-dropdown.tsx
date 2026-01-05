'use client';

import { useMemo } from 'react';

import { REMOTE_FILTERS } from '@/lib/filters/core/constants';
import {
  MultiSelectFilterConfigSchema,
  SingleSelectFilterConfigSchema,
} from '@/lib/filters/core/schemas';

import { capitalizeSlug } from '@/lib/shared/utils/capitalize';

import { useDropdownLabel } from '@/lib/filters/hooks/use-dropdown-label';

import { RemoteVirtualizedCommand } from '@/lib/shared/ui/virtualized-command/remote-virtualized-command';
import { SearchBeforeItems } from '@/lib/filters/ui/active-filters/search-before-items';
import { FilterDropdown } from '@/lib/filters/ui/filter-dropdown';

import { useCsvParam } from './use-csv-param';

interface Props {
  config: SingleSelectFilterConfigSchema | MultiSelectFilterConfigSchema;
}

export const RemoteSearchDropdown = ({ config }: Props) => {
  const label = useDropdownLabel(config);
  const endpointUrl = REMOTE_FILTERS[config.paramKey as keyof typeof REMOTE_FILTERS];
  const endpoint = (query: string) => `${endpointUrl}?query=${query}`;

  const { filterParam, checkIsActive, toggleItem } = useCsvParam(config.paramKey);

  const options = useMemo(() => {
    return config.options.filter((option) => !checkIsActive(option.value));
  }, [checkIsActive, config.options]);

  const selectedOptions = useMemo(() => {
    const filterParamValues = filterParam?.split(',') || [];
    return filterParamValues.map((paramValue) => ({
      label: capitalizeSlug(paramValue),
      value: paramValue,
    }));
  }, [filterParam]);

  const selectedValues = useMemo(() => {
    return selectedOptions.map((option) => option.value);
  }, [selectedOptions]);

  return (
    <FilterDropdown
      label={label}
      truncateLabel
      classNames={{
        trigger: 'rounded-l-none border-l-0',
        content: 'relative flex w-52 flex-col gap-2 bg-muted p-0',
      }}
    >
      <RemoteVirtualizedCommand<{ name: string; normalizedName: string }[]>
        queryKey={[config.paramKey]}
        options={options}
        onSelect={(value) => toggleItem(value, true)}
        endpoint={endpoint}
        selectedValues={selectedValues}
        transformResponse={(data) =>
          data.map((d) => ({ label: d.name, value: d.normalizedName }))
        }
        beforeItems={
          <SearchBeforeItems items={selectedOptions} onToggleItem={toggleItem} />
        }
        classNames={{
          command: 'bg-secondary',
        }}
      />
    </FilterDropdown>
  );
};
