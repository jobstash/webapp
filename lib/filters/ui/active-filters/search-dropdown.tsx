'use client';

import { useQueryState } from 'nuqs';

import {
  MultiSelectFilterConfigSchema,
  SingleSelectFilterConfigSchema,
} from '@/lib/filters/core/schemas';

import { useDropdownLabel } from '@/lib/filters/hooks/use-dropdown-label';

import { VirtualizedCommand } from '@/lib/shared/ui/virtualized-command';
import { FilterDropdown } from '@/lib/filters/ui/filter-dropdown';

interface Props {
  config: SingleSelectFilterConfigSchema | MultiSelectFilterConfigSchema;
}

export const SearchDropdown = ({ config }: Props) => {
  const label = useDropdownLabel(config);

  const [, setFilterParam] = useQueryState(config.paramKey);

  return (
    <FilterDropdown label={label} classNames={{ trigger: 'rounded-l-none border-l-0' }}>
      <VirtualizedCommand
        options={config.options}
        placeholder={`Search ${config.label.toLowerCase()}...`}
        onSelect={setFilterParam}
      />
    </FilterDropdown>
  );
};
