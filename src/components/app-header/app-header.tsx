import { SlidersHorizontalIcon, UserIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Brand } from './brand';
import { SearchHeader } from './search-header';

export const AppHeader = () => {
  return (
    <header className='sticky top-0 z-40 flex justify-center border-b border-neutral-900 bg-background/40 backdrop-blur-lg'>
      <div className='flex h-16 w-full max-w-7xl items-center gap-3 px-2 lg:h-20 lg:gap-3'>
        <div className='w-fit lg:w-68'>
          <Brand />
        </div>

        <div className='flex grow items-center lg:pl-3'>
          <SearchHeader />
          <Button
            size='icon'
            variant='secondary'
            aria-label='Filters'
            className='rounded-xl border border-neutral-800 lg:hidden'
          >
            <SlidersHorizontalIcon className='size-5 text-muted-foreground' />
          </Button>
        </div>

        <div>
          <Button
            size='icon'
            variant='secondary'
            aria-label='User menu'
            className='rounded-xl border border-neutral-800 lg:hidden'
          >
            <UserIcon className='size-5 text-muted-foreground' />
          </Button>
          <Button size='lg' variant='secondary' className='hidden h-10 w-40 lg:block'>
            Login / Signup
          </Button>
        </div>
      </div>
    </header>
  );
};
