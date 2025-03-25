import { AuthButton } from '@/lib/auth/ui/auth-button';
import { FiltersAside } from '@/lib/filters/ui/filters-aside';

import { SidebarAsideLayout } from '@/lib/shared/layouts/sidebar-aside-layout';

const HomePageAside = () => (
  <div className='flex flex-col gap-8'>
    <AuthButton />
    <FiltersAside />
  </div>
);

const Layout = ({ children }: React.PropsWithChildren) => {
  return <SidebarAsideLayout aside={<HomePageAside />}>{children}</SidebarAsideLayout>;
};

export default Layout;
