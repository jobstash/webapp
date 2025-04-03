'use client';

import { FILTER_KIND } from '@/lib/filters/core/constants';
import { FilterConfigItemSchema } from '@/lib/filters/core/schemas';

import { FilterDropdownMapper } from './filter-dropdown-mapper';
import { MainButton } from './main-button';
import { useInitFilterParams } from './use-init-filter-params';

interface Props {
  config: FilterConfigItemSchema;
}

export const ActiveFilterItem = ({ config }: Props) => {
  const isSwitch = config.kind === FILTER_KIND.SWITCH;
  const { filterParamValue } = useInitFilterParams(config);

  return (
    <div className='flex overflow-hidden rounded-md'>
      <MainButton config={config} />
      {!isSwitch && (
        <>
          <div className='flex items-center bg-secondary'>
            <div className='h-4 w-px bg-neutral-600/60'></div>
          </div>
          <FilterDropdownMapper filterParamValue={filterParamValue} config={config} />
        </>
      )}
    </div>
  );
};
