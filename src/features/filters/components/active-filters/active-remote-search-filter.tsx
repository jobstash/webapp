'use client';

import { capitalizeSlug } from '@/lib/utils';
import { RemoteVirtualizedCommand } from '@/components/remote-virtualized-command';
import type {
  MultiSelectFilterConfigSchema,
  SingleSelectFilterConfigSchema,
} from '@/features/filters/schemas';
import { REMOTE_FILTERS } from '@/features/filters/constants';
import { useDropdownLabel } from '@/features/filters/hooks';
import { FilterDropdown } from '@/features/filters/components/filter-dropdown';

import { useCsvParam } from './use-csv-param';

interface Props {
  config: SingleSelectFilterConfigSchema | MultiSelectFilterConfigSchema;
}

export const ActiveRemoteSearchFilter = ({ config }: Props) => {
  const label = useDropdownLabel(config);
  const endpointUrl =
    REMOTE_FILTERS[config.paramKey as keyof typeof REMOTE_FILTERS];
  const endpoint = (query: string) => `${endpointUrl}?query=${query}`;

  const { filterParam, toggleItem } = useCsvParam(config.paramKey);

  const initialValues = config.options.map((option) => option.value);
  const selectedValues = filterParam?.split(',') || [];

  return (
    <FilterDropdown
      label={label}
      classNames={{
        trigger: 'rounded-l-none border-l-0',
        content: 'relative flex w-52 flex-col gap-2 bg-muted p-0',
      }}
    >
      <RemoteVirtualizedCommand<{ name: string; normalizedName: string }[]>
        queryKey={[config.paramKey]}
        endpoint={endpoint}
        initialValues={initialValues}
        selectedValues={selectedValues}
        responseToValues={(data) => data.map((d) => d.normalizedName)}
        formatLabel={capitalizeSlug}
        onSelect={(value) => toggleItem(value, true)}
        onDeselect={(value) => toggleItem(value, false)}
        classNames={{
          command: 'bg-secondary',
        }}
      />
    </FilterDropdown>
  );
};
