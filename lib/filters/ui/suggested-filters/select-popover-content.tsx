'use client';

import { useQueryState } from 'nuqs';

import {
  CheckboxFilterConfigSchema,
  MultiSelectFilterConfigSchema,
  RadioFilterConfigSchema,
  SingleSelectFilterConfigSchema,
} from '@/lib/filters/core/schemas';
import { useFilterStore } from '@/lib/filters/core/store';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/lib/shared/ui/base/command';

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
  const showSearchInput = options.length > 6;

  const [, setFilterParam] = useQueryState(config.paramKey);

  const addActiveFilter = useFilterStore((state) => state.addActiveFilter);
  const onSelect = (value: string) => {
    addActiveFilter(config);
    setFilterParam(value);
  };

  return (
    <Command>
      {showSearchInput && (
        <CommandInput placeholder={`Search ${label.toLowerCase()} ...`} />
      )}
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem key={option.label} value={option.value} onSelect={onSelect}>
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
