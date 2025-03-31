import { Metadata } from 'next';
import { Suspense } from 'react';

import { Header } from '@/lib/shared/ui/header';
import { FiltersAside } from '@/lib/filters/ui/filters-aside';
import { FiltersAsideSkeleton } from '@/lib/filters/ui/filters-aside';

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
      <Header />
      {children}
    </SidebarAsideLayout>
  );
};

export default Layout;
