import { MenuIcon, SearchIcon } from 'lucide-react';

import { Button } from '@/lib/shared/ui/base/button';
import { Brand } from '@/lib/shared/ui/brand';

export const MobileHeader = () => {
  return (
    <div className='flex h-16 w-full items-center justify-between px-2 py-4 md:hidden'>
      <Brand />
      <div className='flex items-center justify-end gap-2'>
        <Button variant='secondary' size='icon'>
          <SearchIcon className='size-5' />
        </Button>
        <Button variant='secondary' size='icon'>
          <MenuIcon className='size-6' />
        </Button>
      </div>
    </div>
  );
};
