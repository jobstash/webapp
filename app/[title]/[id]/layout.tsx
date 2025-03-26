import { SidebarAsideLayout } from '@/lib/shared/layouts/sidebar-aside-layout';

const Layout = ({ children }: React.PropsWithChildren) => {
  return <SidebarAsideLayout>{children}</SidebarAsideLayout>;
};
export default Layout;
