import { Suspense } from 'react';

import { FiltersAside } from '@/lib/filters/ui/filters-aside';
import { FiltersAsideSkeleton } from '@/lib/filters/ui/filters-aside';

import { SidebarAsideLayout } from '@/lib/shared/layouts/sidebar-aside-layout';

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <SidebarAsideLayout
      aside={
        <Suspense fallback={<FiltersAsideSkeleton />}>
          <FiltersAside />
        </Suspense>
      }
    >
      {children}
    </SidebarAsideLayout>
  );
};

export default Layout;
