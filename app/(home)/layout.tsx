import { Metadata } from 'next';

import { SocialsSidebar } from '@/lib/shared/ui/sidebar/socials-sidebar';
import { AuthButton } from '@/lib/auth/ui/auth-button';
import { LazyFiltersAside } from '@/lib/filters/ui/filters-aside';
import { ProfileButton } from '@/lib/profile/ui/profile-button';

import { SidebarLayout } from '@/lib/shared/layouts/sidebar-layout';

export const metadata: Metadata = {
  title: 'Crypto Native Jobs',
  description:
    'Explore crypto native jobs across the entire crypto ecosystem, powered by AI and enhanced by unique data insights as a public good.',
};

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <SidebarLayout
      sidebar={
        <>
          <LazyFiltersAside />
          <SocialsSidebar />
        </>
      }
      userAction={<AuthButton profileButton={<ProfileButton />} />}
    >
      {children}
    </SidebarLayout>
  );
};

export default Layout;
