import { fetchFilterConfigs } from '@/lib/filters/data/fetch-filter-configs';

import { AdvancedFilters } from '@/lib/filters/ui/advanced-filters';
import { BasicFilters } from '@/lib/filters/ui/basic-filters';

import { AdvancedFiltersToggle } from './advanced-filters-toggle';
import { FiltersProvider } from './context';
import { FiltersContent } from './filters-content';

export const FiltersAside = async () => {
  const { basicFilters, advancedFilters } = await fetchFilterConfigs();

  return (
    <FiltersProvider>
      <div className='flex w-full flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
        <div className='-mr-2 flex items-center justify-between'>
          <span className='font-medium'>Filters</span>
          <AdvancedFiltersToggle />
        </div>
        <FiltersContent
          basicFilters={<BasicFilters filters={basicFilters} />}
          advancedFilters={<AdvancedFilters filters={advancedFilters} />}
        />
      </div>
    </FiltersProvider>
  );
};
