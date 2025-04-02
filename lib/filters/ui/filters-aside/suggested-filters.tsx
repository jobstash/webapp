'use client';

import { FILTER_KIND } from '@/lib/filters/core/constants';
import { FilterConfigItemSchema } from '@/lib/filters/core/schemas';
import { useFilterStore } from '@/lib/filters/core/store';

import { Button } from '@/lib/shared/ui/base/button';
import { filterIconMap } from '@/lib/filters/ui/filter-icon-map';

const getIconKey = (config: FilterConfigItemSchema) => {
  const isRange = config.kind === FILTER_KIND.RANGE;
  return isRange ? config.min.paramKey : config.paramKey;
};

interface ItemProps {
  config: FilterConfigItemSchema;
}

const SuggestedFilterItem = ({ config }: ItemProps) => {
  const { label } = config;
  const paramKey = getIconKey(config);
  const icon = filterIconMap[paramKey];
  const addActiveFilter = useFilterStore((state) => state.addActiveFilter);
  const onClick = () => addActiveFilter(config);
  return (
    <Button
      size='xs'
      className='h-7 items-center gap-1.5 border border-dashed bg-sidebar text-muted-foreground/80 hover:bg-muted'
      onClick={onClick}
    >
      <div className='h-4 shrink-0'>{icon}</div>
      {label}
    </Button>
  );
};

interface Props {
  filters: FilterConfigItemSchema[];
}

export const SuggestedFilters = ({ filters }: Props) => {
  const activeLabels = useFilterStore((state) => state.activeLabels);
  const suggestedFilters = filters.filter(
    (config) => config.isSuggested && !activeLabels.has(config.label),
  );
  return (
    <div className='flex flex-wrap gap-2'>
      {suggestedFilters.map((config) => (
        <SuggestedFilterItem key={config.label} config={config} />
      ))}
    </div>
  );
};
