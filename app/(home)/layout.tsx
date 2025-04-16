import { Metadata } from 'next';
import { Suspense } from 'react';

import { Header } from '@/lib/shared/ui/header';
import { FiltersAside, FiltersAsideSkeleton } from '@/lib/filters/ui/filters-aside';
import { SortFilters, SortFiltersSkeleton } from '@/lib/filters/ui/sort-filters';
import { SearchInput } from '@/lib/search/ui/search-input';

import { LazyMobileOverlays } from './lazy-mobile-overlays';

import { SidebarAsideLayout } from '@/lib/shared/layouts/sidebar-aside-layout';
export const metadata: Metadata = {
  title: 'Crypto Native Jobs',
  description:
    'Explore crypto native jobs across the entire crypto ecosystem, powered by AI and enhanced by unique data insights as a public good.',
};

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <SidebarAsideLayout
      aside={
        <Suspense fallback={<FiltersAsideSkeleton />}>
          <FiltersAside />
        </Suspense>
      }
    >
      <Header
        searchInput={
          <SearchInput
            actions={
              <Suspense fallback={<SortFiltersSkeleton />}>
                <SortFilters />
              </Suspense>
            }
          />
        }
        filterItems={null}
      />
      {children}
      <LazyMobileOverlays />
    </SidebarAsideLayout>
  );
};

export default Layout;
