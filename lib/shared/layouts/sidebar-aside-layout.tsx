import { Sidebar } from '@/lib/shared/ui/sidebar';
import { AuthButton } from '@/lib/auth/ui/auth-button';
import { ProfileButton } from '@/lib/profile/ui/profile-button';

interface Props extends React.PropsWithChildren {
  aside?: React.ReactNode;
}

export const SidebarAsideLayout = ({ children, aside = null }: Props) => {
  return (
    <div className='flex min-h-screen justify-center'>
      <div className='relative flex w-full xl:container'>
        <div className='sticky top-0 z-40 hidden h-screen w-72 p-6 lg:block'>
          <Sidebar />
        </div>

        <div className='relative flex max-w-4xl flex-1 flex-col gap-6 pt-6'>
          {children}
        </div>

        <div className='sticky top-0 z-40 hidden h-screen w-96 p-6 lg:block'>
          <div className='flex flex-col gap-6'>
            <AuthButton profileButton={<ProfileButton />} />
            {aside}
          </div>
        </div>
      </div>
    </div>
  );
};
