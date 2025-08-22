import { Brand } from '@/lib/shared/ui/brand';
import { SocialsSidebar } from '@/lib/shared/ui/sidebar/socials-sidebar';

import { SearchHeader } from './search-header';

interface Props extends React.PropsWithChildren {
  sidebar: React.ReactNode;
  userAction: React.ReactNode;
}

export const SidebarLayout = ({ children, sidebar, userAction }: Props) => {
  return (
    <>
      {/* HEADER */}
      <div className='sticky top-0 z-40 flex justify-center bg-background/40 backdrop-blur-lg'>
        <div className='flex h-20 w-full max-w-7xl items-center px-4'>
          <div className='w-72'>
            <Brand />
          </div>
          <div className='flex grow items-center'>
            <SearchHeader />
          </div>
          <div className='grid place-items-center'>{userAction}</div>
        </div>
      </div>
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
