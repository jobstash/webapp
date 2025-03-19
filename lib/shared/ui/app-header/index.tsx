import { SearchIcon } from 'lucide-react';

import { Button } from '@/lib/shared/ui/base/button';
import { Input } from '@/lib/shared/ui/base/input';

import { CollapsibleWrapper } from './collapsible-wrapper';

const dummyInvestors = [
  'Polychain Capital',
  'Paradigm',
  'a16z',
  'Coinbase Ventures',
  'Binance Labs',
  'Andreessen Horowitz',
  'Galaxy',
  'FTX Ventures',
  'Apollo',
  'Tiger Global',
  'Sequoia',
  'Y Combinator',
  'Kleiner Perkins',
  'Redpoint',
];

/**
 * A header component that stays fixed at the top of the content area
 */
export const AppHeader = () => {
  return (
    <CollapsibleWrapper
      header={
        <div className='flex h-16 w-full items-center justify-between p-4'>
          <div className='relative flex w-full pr-4 md:block'>
            <SearchIcon className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-zinc-500' />
            <Input
              className='h-10 w-full rounded-xl bg-sidebar pl-10 text-sm'
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
      }
    >
      <div className='flex shrink-0 flex-col gap-4 px-4 pt-4'>
        <h1 className='text-2xl font-bold'>Accounting Jobs in Crypto (331)</h1>
        <p>
          Discover accounting roles in crypto companies. Find opportunities across
          blockchain organizations and decentralized finance projects.
        </p>
        <div className='flex flex-wrap gap-4'>
          {dummyInvestors.map((investor) => (
            <Button key={investor} variant='secondary' size='sm'>
              {investor}
            </Button>
          ))}
        </div>
      </div>
    </CollapsibleWrapper>
  );
};
