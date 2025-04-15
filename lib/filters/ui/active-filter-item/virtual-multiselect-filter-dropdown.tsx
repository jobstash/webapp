'use client';

import { useMemo } from 'react';

import { SearchCheckIcon } from 'lucide-react';

import { Option } from '@/lib/shared/core/types';
import { REMOTE_FILTERS } from '@/lib/filters/core/constants';
import { MultiSelectFilterConfigSchema } from '@/lib/filters/core/schemas';

import { cn } from '@/lib/shared/utils';
import { capitalizeSlug } from '@/lib/shared/utils/capitalize';
import { checkIsRemoteFilter } from '@/lib/filters/utils/check-is-remote-filter';

import { CommandGroup, CommandItem } from '@/lib/shared/ui/base/command';
import { VirtualizedCommand } from '@/lib/shared/ui/virtualized-command';
import { RemoteVirtualizedCommand } from '@/lib/shared/ui/virtualized-command/remote-virtualized-command';

import { useCsvFilterParams } from './use-csv-filter-params';

interface Props {
  config: MultiSelectFilterConfigSchema;
}

export const VirtualMultiselectDropdown = ({ config }: Props) => {
  const { filterParam, isActiveParam, toggleItem } = useCsvFilterParams(
    config.paramKey,
    config.label,
  );

  const options = useMemo(() => {
    return config.options.filter((option) => {
      return !isActiveParam(option.value);
    });
  }, [config.options, isActiveParam]);

  const isRemoteFilter = checkIsRemoteFilter(config);
  const selectedOptions = useMemo(() => {
    if (isRemoteFilter) {
      const filterParamValues = filterParam?.split(',') || [];
      return filterParamValues.map((paramValue) => ({
        label: capitalizeSlug(paramValue),
        value: paramValue,
      }));
    }
    return config.options.filter((option) => isActiveParam(option.value));
  }, [config.options, filterParam, isActiveParam, isRemoteFilter]);

  const onToggleItem = (value: string, nextState: boolean) => {
    toggleItem(value, nextState);
  };

  const beforeItems = (
    <BeforeItems options={selectedOptions} onToggleItem={onToggleItem} />
  );

  if (isRemoteFilter) {
    const endpointUrl = REMOTE_FILTERS[config.paramKey as keyof typeof REMOTE_FILTERS];
    const endpoint = (query: string) => `${endpointUrl}?query=${query}`;
    return (
      <RemoteVirtualizedCommand<{ name: string; normalizedName: string }[]>
        queryKey={[config.paramKey]}
        options={options}
        onSelect={(value) => onToggleItem(value, true)}
        endpoint={endpoint}
        transformResponse={(data) =>
          data.map((d) => ({ label: d.name, value: d.normalizedName }))
        }
        beforeItems={beforeItems}
      />
    );
  }

  return (
    <VirtualizedCommand
      options={options}
      placeholder={`Search ${config.label.toLowerCase()} ...`}
      onSelect={(value) => onToggleItem(value, true)}
      beforeItems={beforeItems}
    />
  );
};

interface BeforeItemsProps {
  options: Option[];
  onToggleItem: (value: string, nextState: boolean) => void;
}

const BeforeItems = ({ options, onToggleItem }: BeforeItemsProps) => (
  <CommandGroup heading='Selected'>
    {options.map(({ label, value }, index) => (
      <CommandItem
        key={label}
        onSelect={() => onToggleItem(value, false)}
        className={cn({ 'aria-selected:bg-transparent': index === 0 })}
      >
        <SearchCheckIcon className='size-3.5 text-primary' />
        {label}
      </CommandItem>
    ))}
  </CommandGroup>
);
