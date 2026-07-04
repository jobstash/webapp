import { Suspense } from 'react';

import type { PillarFilterContext } from '@/features/pillar/schemas';
import { fetchFilterConfigs } from '@/features/filters/server/data';

import { FiltersAsideBoundary } from './filters-aside.error';
import { FiltersAsideLayout } from './filters-aside.layout';
import { FiltersAsideClient } from './filters-aside.client.lazy';
import { FiltersAsideSkeleton } from './filters-aside.skeleton';

interface FiltersAsideProps {
  pillarContext?: PillarFilterContext | null;
  /**
   * Pillar pages render the pillar's implied criteria as visually-active
   * "mock" chips; interacting with any filter navigates to the home page in
   * real filter mode.
   */
  pillarMode?: boolean;
}

const FiltersAsideRSC = async ({
  pillarContext,
  pillarMode,
}: FiltersAsideProps) => {
  const filterConfigs = await fetchFilterConfigs();
  return (
    <FiltersAsideLayout>
      <div className='flex flex-col gap-2 [&_button]:w-fit'>
        <FiltersAsideClient
          configs={filterConfigs}
          pillarContext={pillarContext}
          pillarMode={pillarMode}
        />
      </div>
    </FiltersAsideLayout>
  );
};

const FiltersAsideError = () => (
  <FiltersAsideLayout>
    <p className='text-sm text-muted-foreground'>Failed to load filters</p>
  </FiltersAsideLayout>
);

export const FiltersAside = ({
  pillarContext,
  pillarMode,
}: FiltersAsideProps) => (
  <Suspense fallback={<FiltersAsideSkeleton />}>
    <FiltersAsideBoundary fallback={<FiltersAsideError />}>
      <FiltersAsideRSC pillarContext={pillarContext} pillarMode={pillarMode} />
    </FiltersAsideBoundary>
  </Suspense>
);
