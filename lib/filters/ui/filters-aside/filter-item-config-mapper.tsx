import { FilterIcon } from 'lucide-react';

import { FILTER_KIND } from '@/lib/filters/core/constants';
import { FilterConfigItemSchema } from '@/lib/filters/core/schemas';

import { filterIconMap } from '@/lib/filters/ui/filter-icon-map';

import { ActiveFilterItem } from './active-filter-item';

interface Props {
  config: FilterConfigItemSchema;
}

export const FilterItemConfigMapper = ({ config }: Props) => {
  const { kind, label } = config;
  if (kind === FILTER_KIND.RANGE) {
    const icon = filterIconMap[config.min.paramKey] ?? <FilterIcon />;
    return <ActiveFilterItem label={label} itemLabel='Remote' icon={icon} />;
  }

  if (kind === FILTER_KIND.SINGLE_SELECT) {
    const icon = filterIconMap[config.paramKey] ?? <FilterIcon />;
    return <ActiveFilterItem label={label} itemLabel='Remote' icon={icon} />;
  }

  if (kind === FILTER_KIND.MULTI_SELECT) {
    const icon = filterIconMap[config.paramKey] ?? <FilterIcon />;
    return <ActiveFilterItem label={label} itemLabel='Remote' icon={icon} />;
  }

  if (kind === FILTER_KIND.RADIO) {
    const icon = filterIconMap[config.paramKey] ?? <FilterIcon />;
    return <ActiveFilterItem label={label} itemLabel='Remote' icon={icon} />;
  }

  if (kind === FILTER_KIND.CHECKBOX) {
    const icon = filterIconMap[config.paramKey] ?? <FilterIcon />;
    return <ActiveFilterItem label={label} itemLabel='Remote' icon={icon} />;
  }

  if (kind === FILTER_KIND.SWITCH) {
    const icon = filterIconMap[config.paramKey] ?? <FilterIcon />;
    return <ActiveFilterItem label={label} itemLabel='Remote' icon={icon} />;
  }

  return null;
};
