import { Metadata } from 'next';

import { LazyFiltersAside } from '@/lib/filters/ui/filters-aside';

import { SidebarLayout } from '@/lib/shared/layouts/sidebar-layout';

export const metadata: Metadata = {
  title: 'Crypto Native Jobs',
  description:
    'Explore crypto native jobs across the entire crypto ecosystem, powered by AI and enhanced by unique data insights as a public good.',
};

const Layout = ({ children }: React.PropsWithChildren) => {
  return <SidebarLayout sidebar={<LazyFiltersAside />}>{children}</SidebarLayout>;
};

export default Layout;
