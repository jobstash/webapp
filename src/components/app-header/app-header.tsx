import { SearchHeader } from '@/features/search';

import { Brand } from './brand';
import { HeaderAuthButton } from './header-auth-button';

export const AppHeader = () => {
  return (
    <header className='sticky top-0 z-40 flex justify-center border-b border-neutral-900 bg-background/40 backdrop-blur-lg'>
      <div className='flex h-16 w-full max-w-7xl items-center gap-3 px-2 lg:h-20 lg:gap-3'>
        <div className='w-fit lg:w-68'>
          <Brand />
        </div>

        <div className='flex grow items-center lg:pl-3'>
          <SearchHeader />
        </div>

        <HeaderAuthButton />
      </div>
    </header>
  );
};
