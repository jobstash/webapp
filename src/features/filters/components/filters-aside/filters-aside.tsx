import { Suspense } from 'react';

import { fetchFilterConfigs } from '@/features/filters/server/data';

import { FiltersAsideBoundary } from './filters-aside.error';
import { FiltersAsideLayout } from './filters-aside.layout';
import { FiltersAsideClient } from './filters-aside.client';
import { FiltersAsideSkeleton } from './filters-aside.skeleton';

const FiltersAsideRSC = async () => {
  const filterConfigs = await fetchFilterConfigs();
  return (
    <FiltersAsideLayout>
      <div className='flex flex-col gap-2 [&_button]:w-fit'>
        <FiltersAsideClient configs={filterConfigs} />
      </div>
    </FiltersAsideLayout>
  );
};

const FiltersAsideError = () => (
  <FiltersAsideLayout>
    <p className='text-sm text-muted-foreground'>Failed to load filters</p>
  </FiltersAsideLayout>
);

export const FiltersAside = () => (
  <Suspense fallback={<FiltersAsideSkeleton />}>
    <FiltersAsideBoundary fallback={<FiltersAsideError />}>
      <FiltersAsideRSC />
    </FiltersAsideBoundary>
  </Suspense>
);
