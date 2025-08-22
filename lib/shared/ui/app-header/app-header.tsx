import { Brand } from '@/lib/shared/ui/brand';

import { SearchHeader } from './search-header';

interface Props {
  userAction: React.ReactNode;
}

export const AppHeader = ({ userAction }: Props) => {
  return (
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
  );
};
