import { Brand } from '@/lib/shared/ui/brand';

import { ProfileAction } from './profile-action';
import { SearchHeader } from './search-header';

interface Props extends React.PropsWithChildren {
  sidebar: React.ReactNode;
}

export const SidebarLayout = ({ children, sidebar }: Props) => {
  return (
    <>
      {/* HEADER */}
      <div className='sticky top-0 z-40 flex justify-center bg-background/40 backdrop-blur-lg'>
        <div className='flex h-20 w-full max-w-7xl items-center'>
          <div className='w-72'>
            <Brand />
          </div>
          <div className='flex grow items-center'>
            <SearchHeader />
          </div>
          <div>
            <ProfileAction />
          </div>
        </div>
      </div>
      <div className='flex w-full justify-center'>
        <div className='relative flex w-full max-w-7xl pt-2'>
          <div className='sticky top-22 flex h-fit w-72 shrink-0 flex-col'>{sidebar}</div>
          <main className='flex grow flex-col px-6'>{children}</main>
        </div>
      </div>
    </>
  );
};
