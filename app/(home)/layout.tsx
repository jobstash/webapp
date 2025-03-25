import { AppAside } from '@/lib/shared/ui/app-aside';

import { SidebarAsideLayout } from '@/lib/shared/layouts/sidebar-aside-layout';

const Layout = ({ children }: React.PropsWithChildren) => {
  return <SidebarAsideLayout aside={<AppAside />}>{children}</SidebarAsideLayout>;
};

export default Layout;
