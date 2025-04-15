'use client';

import { useQueryState } from 'nuqs';

import {
  MultiSelectFilterConfigSchema,
  SingleSelectFilterConfigSchema,
} from '@/lib/filters/core/schemas';

import { VirtualizedCommand } from '@/lib/shared/ui/virtualized-command';

import { Dropdown } from './dropdown';

interface Props {
  config: SingleSelectFilterConfigSchema | MultiSelectFilterConfigSchema;
}

export const SearchDropdown = ({ config }: Props) => {
  const [, setFilterParam] = useQueryState(config.paramKey);

  return (
    <Dropdown config={config}>
      <VirtualizedCommand
        options={config.options}
        placeholder={`Search ${config.label.toLowerCase()}...`}
        onSelect={setFilterParam}
      />
    </Dropdown>
  );
};
