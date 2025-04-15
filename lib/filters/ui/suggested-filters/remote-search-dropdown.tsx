'use client';

import { useQueryState } from 'nuqs';

import { REMOTE_FILTERS } from '@/lib/filters/core/constants';
import {
  MultiSelectFilterConfigSchema,
  SingleSelectFilterConfigSchema,
} from '@/lib/filters/core/schemas';

import { RemoteVirtualizedCommand } from '@/lib/shared/ui/virtualized-command/remote-virtualized-command';

import { Dropdown } from './dropdown';

interface Props {
  config: SingleSelectFilterConfigSchema | MultiSelectFilterConfigSchema;
}

export const RemoteSearchDropdown = ({ config }: Props) => {
  const [, setFilterParam] = useQueryState(config.paramKey);

  const endpointUrl = REMOTE_FILTERS[config.paramKey as keyof typeof REMOTE_FILTERS];
  const endpoint = (query: string) => `${endpointUrl}?query=${query}`;

  return (
    <Dropdown config={config}>
      <RemoteVirtualizedCommand<{ name: string; normalizedName: string }[]>
        queryKey={[config.paramKey]}
        options={config.options}
        onSelect={setFilterParam}
        endpoint={endpoint}
        transformResponse={(data) =>
          data.map((d) => ({ label: d.name, value: d.normalizedName }))
        }
      />
    </Dropdown>
  );
};
