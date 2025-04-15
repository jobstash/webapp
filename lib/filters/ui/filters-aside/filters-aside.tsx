import { fetchFilterConfigs } from '@/lib/filters/data/fetch-filter-configs';

import { ActiveFilters } from '@/lib/filters/ui/active-filters';
import { MoreFilters } from '@/lib/filters/ui/more-filters';
import { SuggestedFilters } from '@/lib/filters/ui/suggested-filters';

export const FiltersAside = async () => {
  const configs = await fetchFilterConfigs();
  return (
    <div className='flex w-full flex-col gap-4 overflow-y-auto rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
      <span className='font-medium'>Filters</span>
      <div className='flex flex-col gap-2 [&_button]:w-fit'>
        <ActiveFilters configs={configs} />
        <SuggestedFilters configs={configs} />
        <MoreFilters configs={configs} />
      </div>
    </div>
  );
};
