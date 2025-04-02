'use client';

import dynamic from 'next/dynamic';

// Dynamically load overlay components to reduce initial bundle size
const FullPageMenuOverlay = dynamic(
  () =>
    import('@/lib/shared/ui/full-page-menu-overlay').then(
      (mod) => mod.FullPageMenuOverlay,
    ),
  { ssr: false },
);

const FullPageSearchOverlay = dynamic(
  () =>
    import('@/lib/search/ui/full-page-search-overlay').then(
      (mod) => mod.FullPageSearchOverlay,
    ),
  { ssr: false },
);

const FullPageFiltersOverlay = dynamic(
  () =>
    import('@/lib/filters/ui/full-page-filters-overlay').then(
      (mod) => mod.FullPageFiltersOverlay,
    ),
  { ssr: false },
);

export const LazyMobileOverlays = () => {
  return (
    <>
      <FullPageMenuOverlay />
      <FullPageSearchOverlay />
      <FullPageFiltersOverlay />
    </>
  );
};
