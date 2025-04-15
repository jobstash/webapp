'use client';

import { FilterConfigSchema } from '@/lib/filters/core/schemas';

import { checkFilterHasDropdown } from '@/lib/filters/utils/check-filter-has-dropdown';

import { DropdownTrigger } from './dropdown-trigger';
import { MainTrigger } from './main-trigger';
import { TriggerDivider } from './trigger-divider';

interface Props {
  config: FilterConfigSchema;
}

export const ActiveFilterItem = ({ config }: Props) => {
  const hasDropdown = checkFilterHasDropdown(config);

  return (
    <div className='flex overflow-hidden rounded-md'>
      <MainTrigger config={config} hasDropdown={hasDropdown} />
      {hasDropdown && (
        <>
          <TriggerDivider />
          <DropdownTrigger config={config} />
        </>
      )}
    </div>
  );
};
