import { FILTER_KIND } from '@/lib/filters/core/constants';

import { fetchFilterConfigs } from '@/lib/filters/data/fetch-filter-configs';

import { Item } from './item';

export const SortFilters = async () => {
  const configs = await fetchFilterConfigs();
  const sortConfigs = configs.filter((config) => config.kind === FILTER_KIND.SORT);

  return (
    <div className='flex items-center gap-2'>
      {sortConfigs.map((config) => {
        return <Item key={config.label} config={config} />;
      })}
    </div>
  );
};
