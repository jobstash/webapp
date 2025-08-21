import { SearchIcon } from 'lucide-react';

export const SearchHeader = () => {
  return (
    <div className='flex min-w-0 flex-grow items-center gap-2 px-6'>
      <SearchIcon className='h-6 w-6 shrink-0 text-zinc-500' />
      <input
        className='peer h-full w-full flex-grow border-none bg-transparent p-0 shadow-none outline-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
        placeholder='Search ...'
      />
    </div>
  );
};
