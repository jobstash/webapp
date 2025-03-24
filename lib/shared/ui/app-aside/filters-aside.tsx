import { ChevronRightIcon, SearchIcon } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/lib/shared/ui/base/accordion';
import { Button } from '@/lib/shared/ui/base/button';
import { Checkbox } from '@/lib/shared/ui/base/checkbox';
import { Input } from '@/lib/shared/ui/base/input';
import { Label } from '@/lib/shared/ui/base/label';
import { RadioGroup, RadioGroupItem } from '@/lib/shared/ui/base/radio-group';
import { Divider } from '@/lib/shared/ui/divider';

const dummyPublishDateFilters = [
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'this-week' },
  { label: 'This month', value: 'this-month' },
  { label: 'Last month', value: 'last-month' },
];

const dummyWorkModeFilters = [
  { label: 'Remote', value: 'remote' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'On-site', value: 'on-site' },
];

const dummyTags = [
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

// const dummyData = {
//   basicFilters: ['Publish Date', 'Work Mode', 'Salary'],
//   jobFilters: [
//     'Commitment',
//     'Seniority',
//     'Web3 Beginner',
//     'Salary',
//     'Skills',
//     'Category',
//   ],
//   orgFilters: ['Names', 'Employee Count', 'Investors', 'Funding Rounds'],
//   projectFilters: ['Names', 'Chains', 'TVL', 'Audits', 'Hacks'],
// };

export const FiltersAside = () => {
  return (
    <div className='flex w-full flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
      <div className='-mr-2 flex items-center justify-between'>
        <span className='font-medium'>Filters</span>
        <Button size='xs' variant='ghost' className='text-xs text-muted-foreground'>
          Advanced Filters
          <ChevronRightIcon className='size-3' />
        </Button>
      </div>

      <div className='min-h-0 flex-1 overflow-y-auto'>
        <Accordion type='multiple' defaultValue={['date-published', 'work-mode', 'tags']}>
          <AccordionItem value='date-published'>
            <AccordionTrigger>Date Published</AccordionTrigger>
            <AccordionContent className='pl-2'>
              <RadioGroup className='flex flex-col gap-2'>
                {dummyPublishDateFilters.map((filter) => (
                  <div key={filter.value} className='flex items-center space-x-2'>
                    <RadioGroupItem id={filter.value} value={filter.value} />
                    <Label htmlFor={filter.value} className='text-muted-foreground'>
                      {filter.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='work-mode'>
            <AccordionTrigger>Work Mode</AccordionTrigger>
            <AccordionContent className='pl-2'>
              <RadioGroup className='flex flex-col gap-2'>
                {dummyWorkModeFilters.map((filter) => (
                  <div key={filter.value} className='flex items-center space-x-2'>
                    <Checkbox id={filter.value} value={filter.value} />
                    <Label htmlFor={filter.value} className='text-muted-foreground'>
                      {filter.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='tags'>
            <AccordionTrigger>Tags</AccordionTrigger>
            <AccordionContent className='flex flex-col gap-4 pl-4'>
              <div className='relative flex w-full md:block'>
                <SearchIcon className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-zinc-500' />
                <Input
                  className='w-full bg-sidebar pl-10 focus-visible:ring-0'
                  placeholder='Search job tags ...'
                />
              </div>
              <div className='flex flex-wrap gap-2 overflow-y-auto'>
                {dummyTags.map((tag) => (
                  <Button key={tag} variant='secondary' size='xs'>
                    {tag}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <Divider />

      <div className='flex h-16 items-center justify-center bg-sidebar/80 px-4'>
        <Button variant='secondary' className='w-full' size='lg'>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};
