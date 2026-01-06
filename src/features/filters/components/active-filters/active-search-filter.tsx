'use client';

import { SearchCheckIcon } from 'lucide-react';

import { capitalizeSlug } from '@/lib/utils';
import { useDropdownLabel } from '@/features/filters/hooks';
import { type MultiSelectFilterConfigSchema } from '@/features/filters/schemas';
import { CommandGroup, CommandItem } from '@/components/ui/command';
import { FilterDropdown } from '@/features/filters/components/filter-dropdown';
import { VirtualizedCommand } from '@/components/virtualized-command';

import { useCsvParam } from './use-csv-param';

interface Props {
  config: MultiSelectFilterConfigSchema;
}

export const ActiveSearchFilter = ({ config }: Props) => {
  const label = useDropdownLabel(config);

  const { filterParam, checkIsActive, toggleItem } = useCsvParam(
    config.paramKey,
  );

  const options = config.options.filter(
    (option) => !checkIsActive(option.value),
  );

  const selectedOptions = (filterParam?.split(',') || []).map((paramValue) => ({
    label: capitalizeSlug(paramValue),
    value: paramValue,
  }));

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
          <CommandGroup heading='Selected'>
            {selectedOptions.map(({ label, value }) => (
              <CommandItem
                key={label}
                onSelect={() => toggleItem(value, false)}
                className='data-[selected=true]:bg-white/5'
              >
                <SearchCheckIcon className='size-3.5 text-primary' />
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
        }
        classNames={{
          command: 'bg-secondary',
        }}
      />
    </FilterDropdown>
  );
};
