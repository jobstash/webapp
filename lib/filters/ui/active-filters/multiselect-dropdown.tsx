import { useMemo } from 'react';

import { MultiSelectFilterConfigSchema } from '@/lib/filters/core/schemas';

import { capitalizeSlug } from '@/lib/shared/utils/capitalize';

import { VirtualizedCommand } from '@/lib/shared/ui/virtualized-command';
import { FilterDropdown } from '@/lib/filters/ui/filter-dropdown';

import { SearchBeforeItems } from './search-before-items';
import { useCsvParam } from './use-csv-param';
import { useDropdownLabel } from './use-dropdown-label';

interface Props {
  config: MultiSelectFilterConfigSchema;
}

export const MultiselectDropdown = ({ config }: Props) => {
  const label = useDropdownLabel(config);

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

  return (
    <FilterDropdown
      label={label}
      classNames={{
        content: 'relative flex w-52 flex-col gap-2 bg-muted p-0',
        trigger: 'rounded-l-none border-l-0',
      }}
    >
      <VirtualizedCommand
        options={options}
        placeholder={`Search ${config.label.toLowerCase()} ...`}
        onSelect={(value) => toggleItem(value, true)}
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
