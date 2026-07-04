import { Suspense } from 'react';

import type { PillarFilterContext } from '@/features/pillar/schemas';
import { fetchFilterConfigs } from '@/features/filters/server/data';

import { FiltersAsideBoundary } from './filters-aside.error';
import { FiltersDrawerClient } from './filters-drawer.client';

interface FiltersDrawerProps {
  pillarContext?: PillarFilterContext | null;
  pillarMode?: boolean;
}

// Filter access for viewports below lg, where the sidebar is hidden: a
// "Filters" button opening the same filter UI in a slide-in sheet. Render
// inside an `lg:hidden` wrapper. The configs fetch is request-deduped with
// the sidebar's.
const FiltersDrawerRSC = async ({
  pillarContext,
  pillarMode,
}: FiltersDrawerProps) => {
  const filterConfigs = await fetchFilterConfigs();
  return (
    <FiltersDrawerClient
      configs={filterConfigs}
      pillarContext={pillarContext}
      pillarMode={pillarMode}
    />
  );
};

export const FiltersDrawer = (props: FiltersDrawerProps) => (
  <Suspense fallback={null}>
    <FiltersAsideBoundary fallback={null}>
      <FiltersDrawerRSC {...props} />
    </FiltersAsideBoundary>
  </Suspense>
);
