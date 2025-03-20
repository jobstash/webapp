import { SearchIcon } from 'lucide-react';

import { Button } from '@/lib/shared/ui/base/button';

const dummyData = [
  'React',
  'Web3',
  'Rust',
  'Solidity',
  'Blockchain',
  'LLM',
  'TypeScript',
  'DeFi',
  'NFT',
  'Smart Contracts',
];

export const TopTags = () => {
  return (
    <div className='flex w-full flex-col gap-4 rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-medium'>Popular Tags</h3>
          <Button size='sm' variant='secondary'>
            <SearchIcon />
          </Button>
        </div>
        <span className='text-sm text-neutral-400'>
          Explore trending technologies and skills in demand across Web3 jobs
        </span>
      </div>
      <div className='flex flex-wrap gap-3 overflow-y-auto'>
        {dummyData.map((tag) => (
          <Button key={tag} variant='secondary' size='sm'>
            {tag}
          </Button>
        ))}
      </div>
    </div>
  );
};
