import { SearchIcon } from 'lucide-react';

export const SearchHeaderSkeleton = () => (
  <div className='flex min-w-0 grow items-center gap-2'>
    <SearchIcon className='size-6 shrink-0 text-zinc-500' />
    <div className='h-6 w-full animate-pulse rounded bg-neutral-800' />
  </div>
);
