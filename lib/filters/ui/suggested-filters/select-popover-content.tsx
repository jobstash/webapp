'use client';

import { useQueryState } from 'nuqs';

import { REMOTE_FILTERS } from '@/lib/filters/core/constants';
import {
  CheckboxFilterConfigSchema,
  MultiSelectFilterConfigSchema,
  RadioFilterConfigSchema,
  SingleSelectFilterConfigSchema,
} from '@/lib/filters/core/schemas';
import { useFilterStore } from '@/lib/filters/core/store';

import { checkIsRemoteFilter } from '@/lib/filters/utils/check-is-remote-filter';

import { SimpleCommand } from '@/lib/shared/ui/simple-command';
import { VirtualizedCommand } from '@/lib/shared/ui/virtualized-command';
import { RemoteVirtualizedCommand } from '@/lib/shared/ui/virtualized-command/remote-virtualized-command';

type SelectConfig =
  | SingleSelectFilterConfigSchema
  | MultiSelectFilterConfigSchema
  | RadioFilterConfigSchema
  | CheckboxFilterConfigSchema;

interface Props {
  config: SelectConfig;
}

export const SelectPopoverContent = ({ config }: Props) => {
  const { label, options } = config;
  const hasFewItems = options.length <= 6;

  const [, setFilterParam] = useQueryState(config.paramKey);

  const addActiveFilter = useFilterStore((state) => state.addActiveFilter);
  const onSelect = (value: string) => {
    addActiveFilter(config);
    setFilterParam(value);
  };

  if (hasFewItems) {
    return <SimpleCommand options={options} onSelect={onSelect} />;
  }

  // Tags have its own endpoint for query
  const isRemoteFilter = checkIsRemoteFilter(config);
  if (isRemoteFilter) {
    const endpointUrl = REMOTE_FILTERS[config.paramKey as keyof typeof REMOTE_FILTERS];
    const endpoint = (query: string) => `${endpointUrl}?query=${query}`;
    return (
      <RemoteVirtualizedCommand<{ name: string; normalizedName: string }[]>
        queryKey={[config.paramKey]}
        options={options}
        onSelect={onSelect}
        endpoint={endpoint}
        transformResponse={(data) =>
          data.map((d) => ({ label: d.name, value: d.normalizedName }))
        }
      />
    );
  }

  return (
    <VirtualizedCommand
      options={options}
      placeholder={`Search ${label.toLowerCase()}...`}
      onSelect={onSelect}
    />
  );
};
