import { SwitchFilterConfigSchema } from '@/lib/filters/core/schemas';

import { FilterAccordionItem } from './filter-accordion-item';

interface Props {
  config: SwitchFilterConfigSchema;
}

export const SwitchFilter = ({ config }: Props) => {
  return (
    <FilterAccordionItem label={config.label}>
      <div>TODO: SwitchFilter: {config.label}</div>
    </FilterAccordionItem>
  );
};
