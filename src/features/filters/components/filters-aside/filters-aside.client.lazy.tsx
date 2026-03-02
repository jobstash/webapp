'use client';

import dynamic from 'next/dynamic';

export const FiltersAsideClient = dynamic(
  () => import('./filters-aside.client').then((mod) => mod.FiltersAsideClient),
  {
    loading: () => null,
  },
);
