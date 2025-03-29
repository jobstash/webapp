import { SearchIcon } from 'lucide-react';

import { Button } from '@/lib/shared/ui/base/button';
import { Input } from '@/lib/shared/ui/base/input';

const dummyItems = [
  'Remote Jobs',
  'Jobs for Experts',
  'Frontend Developer',
  'Ethereum',
  'Web3 Beginners',
];

export const AppHeader = () => {
  return (
    <div className='sticky top-0 z-30 w-full overflow-hidden border border-neutral-800/50 bg-sidebar/30 backdrop-blur-md lg:top-6 lg:mt-6 lg:rounded-2xl'>
      <div className='flex h-16 w-full items-center justify-between p-4'>
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
      <div className='flex shrink-0 flex-col gap-4 p-4'>
        <h1 className='text-2xl font-bold'>Crypto Native Jobs</h1>
        <p>
          Explore crypto native jobs across the entire crypto ecosystem, powered by AI and
          enhanced by unique data insights as a public good.
        </p>
        <div className='flex flex-wrap gap-4'>
          {dummyItems.map((category) => (
            <Button key={category} variant='secondary' size='sm'>
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
