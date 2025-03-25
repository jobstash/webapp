'use client';

import { Button } from '@/lib/shared/ui/base/button';

export const ApplyButton = () => {
  return (
    <div className='flex h-16 items-center justify-center bg-sidebar/80 px-4'>
      <Button variant='secondary' className='w-full' size='lg'>
        Apply Filters
      </Button>
    </div>
  );
};
