import { SearchIcon } from 'lucide-react';

import { Button } from '@/lib/shared/ui/base/button';
import { Input } from '@/lib/shared/ui/base/input';

import { CollapsibleWrapperClient } from './collapsible-wrapper.client';

const dummyItems = [
  'Remote Jobs',
  'Jobs for Experts',
  'Junior Roles',
  'Frontend Developer',
  'LLM',
  'Web3 Beginners',
  'Ethereum',
  'Rust',
  'Backend Engineer',
  'Coinbase',
  'Marketing',
  'Internship',
  'Onsite',
  'Europe',
];

export const AppHeader = () => {
  return (
    <CollapsibleWrapperClient>
      <div
        data-collapsible-header
        className='flex h-16 w-full items-center justify-between p-4'
      >
        <div className='relative flex w-full pr-4 md:block'>
          <SearchIcon className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-zinc-500' />
          <Input
            className='h-10 w-full rounded-lg bg-sidebar pl-10 text-sm'
            placeholder='Search 3129 jobs'
          />
        </div>
        <div className='flex items-center'>
          <Button variant='ghost' size='sm'>
            Get Listed
          </Button>
          <Button variant='ghost' size='sm'>
            Subscribe on TG
          </Button>
        </div>
      </div>
      <div
        data-collapsible-content
        className='flex shrink-0 flex-col gap-4 px-4 pt-4 pb-8'
      >
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
    </CollapsibleWrapperClient>
  );
};
