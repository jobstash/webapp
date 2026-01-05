'use client';

import { useQueryState } from 'nuqs';

import { SingleSelectFilterConfigSchema } from '@/lib/filters/core/schemas';

import { useDropdownLabel } from '@/lib/filters/hooks/use-dropdown-label';

import { SimpleCommand } from '@/lib/shared/ui/simple-command';
import { FilterDropdown } from '@/lib/filters/ui/filter-dropdown';

interface Props {
  config: SingleSelectFilterConfigSchema;
}

export const SingleSelectDropdown = ({ config }: Props) => {
  const label = useDropdownLabel(config);
  const [, setFilterParam] = useQueryState(config.paramKey);
  return (
    <FilterDropdown
      label={label}
      truncateLabel
      classNames={{ trigger: 'rounded-l-none border-l-0', content: 'bg-muted p-0' }}
    >
      <SimpleCommand
        classNames={{ base: 'bg-muted', item: 'data-[selected=true]:bg-neutral-700/50' }}
        onSelect={setFilterParam}
        options={config.options}
      />
    </FilterDropdown>
  );
};
