'use client';

import { SearchIcon } from 'lucide-react';

import { MultiSelectFilterConfigSchema } from '@/lib/filters/core/schemas';

import { Button } from '@/lib/shared/ui/base/button';
import { Input } from '@/lib/shared/ui/base/input';

import { FilterAccordionItem } from '../filter-accordion-item';

import { useMultiSelectFilter } from './use-multi-select-filter';

const SHOWN_OPTIONS_COUNT = 10;

interface Props {
  config: MultiSelectFilterConfigSchema;
}

export const MultiSelectFilter = ({ config }: Props) => {
  const { options, paramKey, label } = config;
  const { isItemSelected, toggleItem } = useMultiSelectFilter(paramKey);

  const shownOptions = options.slice(0, SHOWN_OPTIONS_COUNT);
  return (
    <FilterAccordionItem label={label} className='flex flex-col gap-4 pl-4'>
      <div className='relative flex w-full md:block'>
        <SearchIcon className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-zinc-500' />
        <Input
          className='w-full bg-sidebar pl-10 focus-visible:ring-0'
          placeholder={`Search job ${label.toLowerCase()} ...`}
        />
      </div>
      <div className='flex flex-wrap gap-2 overflow-y-auto'>
        {shownOptions.map(({ label, value }) => (
          <Button
            key={label}
            variant={isItemSelected(value) ? 'default' : 'secondary'}
            size='xs'
            onClick={() => toggleItem(value)}
          >
            {label}
          </Button>
        ))}
      </div>
    </FilterAccordionItem>
  );
};
