import { SingleSelectFilterConfigSchema } from '@/lib/filters/core/schemas';

import { FilterAccordionItem } from './filter-accordion-item';

interface Props {
  config: SingleSelectFilterConfigSchema;
}

export const SingleSelectFilter = ({ config }: Props) => {
  return (
    <FilterAccordionItem label={config.label}>
      <div>TODO: SingleSelectFilter: {config.label}</div>
    </FilterAccordionItem>
  );
};
