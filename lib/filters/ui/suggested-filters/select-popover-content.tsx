'use client';

import { useQueryState } from 'nuqs';

import {
  CheckboxFilterConfigSchema,
  MultiSelectFilterConfigSchema,
  RadioFilterConfigSchema,
  SingleSelectFilterConfigSchema,
} from '@/lib/filters/core/schemas';
import { useFilterStore } from '@/lib/filters/core/store';

import { SimpleCommand } from '@/lib/shared/ui/simple-command';
import { VirtualizedCommand } from '@/lib/shared/ui/virtualized-command';

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
  const hasFewItems = options.length <= 6;

  const [, setFilterParam] = useQueryState(config.paramKey);

  const addActiveFilter = useFilterStore((state) => state.addActiveFilter);
  const onSelect = (value: string) => {
    addActiveFilter(config);
    setFilterParam(value);
  };

  if (hasFewItems) {
    return <SimpleCommand options={options} onSelect={onSelect} />;
  }

  return (
    <VirtualizedCommand
      height='400px'
      options={options}
      placeholder={`Search ${label.toLowerCase()}...`}
      onSelectOption={onSelect}
    />
  );
};
