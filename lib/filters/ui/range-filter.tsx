import { RangeFilterConfigSchema } from '@/lib/filters/core/schemas';

import { FilterAccordionItem } from './filter-accordion-item';

interface Props {
  config: RangeFilterConfigSchema;
}

export const RangeFilter = ({ config }: Props) => {
  return (
    <FilterAccordionItem label={config.label}>
      <div>TODO: RangeFilter: {config.label}</div>
    </FilterAccordionItem>
  );
};
