import { SearchIcon } from 'lucide-react';

import { Button } from '@/lib/shared/ui/base/button';
import { Input } from '@/lib/shared/ui/base/input';

export const DesktopHeader = () => {
  return (
    <div className='hidden h-16 w-full items-center justify-between p-4 md:flex'>
      <div className='relative flex w-full pr-4 md:block'>
        <SearchIcon className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-zinc-500' />
        <Input
          className='h-10 w-full rounded-lg bg-sidebar pl-10 text-sm'
          placeholder='Search 3129 jobs'
        />
      </div>
      <div className='hidden items-center md:flex'>
        <Button variant='ghost' size='sm'>
          Get Listed
        </Button>
        <Button variant='ghost' size='sm'>
          Subscribe on TG
        </Button>
      </div>
    </div>
  );
};
