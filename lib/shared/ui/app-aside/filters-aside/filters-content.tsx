'use client';

import { AdvancedFilters } from './advanced-filters';
import { BasicFilters } from './basic-filters';
import { useFiltersContext } from './context';

export const FiltersContent = () => {
  const { isAdvancedFiltersOpen } = useFiltersContext();
  const content = isAdvancedFiltersOpen ? <AdvancedFilters /> : <BasicFilters />;
  return <div className='relative w-full overflow-x-hidden'>{content}</div>;
};
