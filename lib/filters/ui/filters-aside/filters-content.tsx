'use client';

import { useFiltersContext } from './context';

interface Props {
  basicFilters: React.ReactNode;
  advancedFilters: React.ReactNode;
}

export const FiltersContent = ({ basicFilters, advancedFilters }: Props) => {
  const { isAdvancedFiltersOpen } = useFiltersContext();
  const content = isAdvancedFiltersOpen ? advancedFilters : basicFilters;
  return (
    <div className='relative max-h-[640px] w-full overflow-x-hidden overflow-y-auto'>
      {content}
    </div>
  );
};
