import { AppHeader } from '@/lib/shared/ui/app-header';
import { SocialsSidebar } from '@/lib/shared/ui/sidebar/socials-sidebar';

interface Props extends React.PropsWithChildren {
  sidebar: React.ReactNode;
  userAction: React.ReactNode;
}

export const SidebarLayout = ({ children, sidebar, userAction }: Props) => {
  return (
    <>
      {/* HEADER */}
      <AppHeader userAction={userAction} />
      <div className='flex w-full justify-center'>
        <div className='relative flex w-full max-w-7xl gap-6 px-4 pt-2'>
          <div className='sticky top-22 hidden h-fit w-72 shrink-0 flex-col gap-6 lg:flex'>
            {sidebar}
            <SocialsSidebar />
          </div>
          <main className='flex flex-1 grow flex-col'>{children}</main>
        </div>
      </div>
    </>
  );
};
