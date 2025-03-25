'use client';

import { SearchIcon } from 'lucide-react';

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

export const BasicFilters = () => {
  return (
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
  );
};
