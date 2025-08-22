import { Brand } from '@/lib/shared/ui/brand';

import { SearchHeader } from './search-header';

interface Props {
  userAction: React.ReactNode;
}

export const AppHeader = ({ userAction }: Props) => {
  return (
    <div className='sticky top-0 z-40 flex justify-center bg-background/40 backdrop-blur-lg'>
      <div className='flex h-16 w-full max-w-7xl items-center gap-3 px-4 lg:h-20 lg:gap-6'>
        <div className='w-fit lg:w-72'>
          <Brand />
        </div>
        <div className='flex grow items-center lg:px-6'>
          <SearchHeader />
        </div>
        <div className='grid place-items-center'>{userAction}</div>
      </div>
    </div>
  );
};
