import { FilterConfigSchema } from '@/lib/filters/core/schemas';

import { Accordion } from '@/lib/shared/ui/base/accordion';
import { FilterConfigItemMapper } from '@/lib/filters/ui/filter-config-item-mapper';

interface Props {
  filters: FilterConfigSchema['basicFilters'];
}

export const AdvancedFilters = ({ filters }: Props) => {
  return (
    <Accordion type='multiple'>
      {filters.map((filter) => (
        <FilterConfigItemMapper key={filter.label} config={filter} />
      ))}
    </Accordion>
  );
};
