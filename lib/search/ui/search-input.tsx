'use client';

import { SearchIcon } from 'lucide-react';

import { Input } from '@/lib/shared/ui/base/input';

export const SearchInput = () => {
  return (
    <div className='relative flex w-full md:block'>
      <SearchIcon className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-zinc-500' />
      <Input
        className='h-10 w-full rounded-lg bg-sidebar pl-10 text-sm'
        placeholder='Search 3129 jobs'
      />
    </div>
  );
};
