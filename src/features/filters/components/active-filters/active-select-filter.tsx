'use client';

import { useQueryState } from 'nuqs';

import { SimpleCommand } from '@/components/simple-command';
import { FilterDropdown } from '@/features/filters/components/filter-dropdown';
import { useDropdownLabel } from '@/features/filters/hooks';
import { type SingleSelectFilterConfigSchema } from '@/features/filters/schemas';

interface Props {
  config: SingleSelectFilterConfigSchema;
}

export const ActiveSelectFilter = ({ config }: Props) => {
  const label = useDropdownLabel(config);
  const [, setFilterParam] = useQueryState(config.paramKey);
  return (
    <FilterDropdown
      label={label}
      classNames={{
        trigger: 'rounded-l-none border-l-0',
        content: 'bg-muted p-0',
      }}
    >
      <SimpleCommand
        classNames={{
          base: 'bg-muted',
          item: 'data-[selected=true]:bg-neutral-700/50',
        }}
        onSelect={setFilterParam}
        options={config.options}
      />
    </FilterDropdown>
  );
};
