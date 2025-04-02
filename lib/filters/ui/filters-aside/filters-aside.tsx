import { fetchFilterConfigs } from '@/lib/filters/data/fetch-filter-configs';

import { ActiveFilters } from './active-filters';
import { MoreFilters } from './more-filters';
import { SuggestedFilters } from './suggested-filters';

export const FiltersAside = async () => {
  const filters = await fetchFilterConfigs();
  return (
    <div className='flex w-full flex-col gap-4 overflow-y-auto rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
      <span className='font-medium'>Filters</span>

      <div className='flex flex-col gap-2 [&_button]:w-fit'>
        <ActiveFilters />
        <SuggestedFilters filters={filters} />
        <MoreFilters filters={filters} />
      </div>
    </div>
  );
};
