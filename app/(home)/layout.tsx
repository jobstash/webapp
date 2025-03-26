import { FiltersAside } from '@/lib/filters/ui/filters-aside';

import { SidebarAsideLayout } from '@/lib/shared/layouts/sidebar-aside-layout';

const Layout = ({ children }: React.PropsWithChildren) => {
  return <SidebarAsideLayout aside={<FiltersAside />}>{children}</SidebarAsideLayout>;
};

export default Layout;
