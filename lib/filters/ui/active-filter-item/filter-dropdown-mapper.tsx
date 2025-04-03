import { ChevronDownIcon } from 'lucide-react';

import { FILTER_KIND } from '@/lib/filters/core/constants';
import { FilterConfigItemSchema } from '@/lib/filters/core/schemas';

import { Button } from '@/lib/shared/ui/base/button';
import { CheckboxFilterDropdown } from '@/lib/filters/ui/active-filter-item/checkbox-filter-dropdown';
import { MultiselectFilterDropdown } from '@/lib/filters/ui/active-filter-item/multiselect-filter-dropdown';

interface Props {
  filterParamValue: string | null;
  config: FilterConfigItemSchema;
}

export const FilterDropdownMapper = ({ filterParamValue, config }: Props) => {
  if (!filterParamValue) return null;
  if (config.kind === FILTER_KIND.CHECKBOX) {
    return <CheckboxFilterDropdown filterParamValue={filterParamValue} config={config} />;
  }
  if (config.kind === FILTER_KIND.MULTI_SELECT) {
    return (
      <MultiselectFilterDropdown filterParamValue={filterParamValue} config={config} />
    );
  }
  return (
    <Button
      size='xs'
      variant='secondary'
      className='flex h-7 items-center gap-1.5 rounded-l-none border-l-0 px-2 text-sm hover:bg-neutral-700/50'
    >
      TODO
      <ChevronDownIcon className='size-3.5 text-neutral-400' />
    </Button>
  );
};
