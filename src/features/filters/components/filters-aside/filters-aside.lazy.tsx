import dynamic from 'next/dynamic';

import { FiltersAsideSkeleton } from './filters-aside.skeleton';

export const FiltersAside = dynamic(
  () => import('./filters-aside').then((mod) => mod.FiltersAside),
  {
    loading: () => <FiltersAsideSkeleton />,
  },
);
