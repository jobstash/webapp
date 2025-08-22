import { AuthButton } from '@/lib/auth/ui/auth-button';
import { ProfileButton } from '@/lib/profile/ui/profile-button';

import { ProfileEntrypointMachineProvider } from '@/lib/profile/providers/profile-entrypoint-machine.provider';
import { SidebarLayout } from '@/lib/shared/layouts/sidebar-layout';

const OnboardingSidebar = () => {
  return (
    <div className='flex flex-col gap-8 rounded-2xl bg-sidebar p-6'>
      <div className='grid h-[600px] place-items-center rounded-2xl bg-muted'>
        <p>Onboarding progress</p>
      </div>
    </div>
  );
};

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <SidebarLayout
      sidebar={<OnboardingSidebar />}
      userAction={<AuthButton profileButton={<ProfileButton />} />}
    >
      <ProfileEntrypointMachineProvider>{children}</ProfileEntrypointMachineProvider>
    </SidebarLayout>
  );
};
export default Layout;
