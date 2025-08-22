import { SlidersHorizontalIcon } from 'lucide-react';

import { Button } from '@/lib/shared/ui/base/button';
import { Brand } from '@/lib/shared/ui/brand';

import { SearchHeader } from './search-header';

interface Props {
  userAction: React.ReactNode;
}

export const AppHeader = ({ userAction }: Props) => {
  return (
    <div className='sticky top-0 z-40 flex justify-center bg-background/40 backdrop-blur-lg'>
      <div className='flex h-16 w-full max-w-7xl items-center gap-3 px-3 md:px-4 lg:h-20 lg:gap-3'>
        <div className='w-fit lg:w-68'>
          <Brand />
        </div>
        <div className='flex grow items-center lg:pl-3'>
          <SearchHeader />
          <Button
            size='icon'
            variant='secondary'
            className='size-9 rounded-xl border border-neutral-800'
          >
            <SlidersHorizontalIcon className='size-5 text-muted-foreground' />
          </Button>
        </div>
        <div className='flex items-center gap-3'>{userAction}</div>
      </div>
    </div>
  );
};
