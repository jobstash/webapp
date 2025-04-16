'use client';

import { useMemo } from 'react';

import { useQueryState } from 'nuqs';

import { SortFilterConfigSchema } from '@/lib/filters/core/schemas';

import { cn } from '@/lib/shared/utils';

import { SimpleCommand } from '@/lib/shared/ui/simple-command';
import { FilterDropdown } from '@/lib/filters/ui/filter-dropdown';

const UNSHIFT_THRESHOLD = 6;

interface Props {
  config: SortFilterConfigSchema;
}

export const Item = ({ config }: Props) => {
  const { paramKey, options } = config;
  const [filterParam, setFilterParam] = useQueryState(paramKey);
  const onSelect = (value: string) => {
    const newValue = value === filterParam ? null : value;
    setFilterParam(newValue);
  };

  const label = useMemo(() => {
    return options.find((option) => option.value === filterParam)?.label || config.label;
  }, [config.label, filterParam, options]);

  const displayOptions = useMemo(() => {
    if (filterParam && options.length > UNSHIFT_THRESHOLD) {
      const activeOption = options.find((o) => o.value === filterParam);
      if (activeOption) {
        return [activeOption, ...options.filter((o) => o.value !== filterParam)];
      }
    }
    return options;
  }, [filterParam, options]);

  return (
    <FilterDropdown
      key={label}
      label={label}
      classNames={{
        trigger: cn('rounded-sm bg-white/5', {
          'border border-neutral-700 bg-white/2': !!filterParam,
        }),
        content: 'p-0',
      }}
    >
      <SimpleCommand
        classNames={{ base: 'bg-muted', item: 'data-[selected=true]:bg-neutral-700/50' }}
        onSelect={onSelect}
        options={displayOptions}
      />
    </FilterDropdown>
  );
};
