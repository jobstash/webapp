'use client';

import { useTransition } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FILTER_KIND } from '@/features/filters/constants';
import type {
  FilterConfigSchema,
  SortFilterConfigSchema,
} from '@/features/filters/schemas';
import { useFilterQueryState } from '@/features/filters/hooks';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from './filter-overlay';

export function SortFilters({ configs }: { configs: FilterConfigSchema[] }) {
  const sorts = configs
    .filter((config) => config.kind === FILTER_KIND.SORT)
    .sort(
      (a, b) =>
        Number(b.paramKey === 'orderBy') - Number(a.paramKey === 'orderBy'),
    );
  if (!sorts.length) return null;
  return (
    <section aria-label='Sort results' className='space-y-2'>
      <h3 className='text-[11px] font-medium tracking-wide text-muted-foreground'>
        Sort results
      </h3>
      {sorts.map((config) => (
        <SortControl key={config.paramKey} config={config} />
      ))}
    </section>
  );
}

function SortControl({ config }: { config: SortFilterConfigSchema }) {
  const [value, setValue] = useFilterQueryState(config.paramKey);
  const [pending, startTransition] = useTransition();
  const isDirection = config.paramKey === 'order';
  const label = isDirection ? 'Order' : 'Sort by';
  const selected = value ?? (isDirection ? 'desc' : 'publicationDate');
  const options = config.options.map((option) => ({
    ...option,
    label: isDirection
      ? option.value === 'asc'
        ? 'Ascending'
        : 'Descending'
      : option.label,
  }));
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={pending}>
        <Button
          variant='outline'
          aria-label={`${label} ${options.find((option) => option.value === selected)?.label ?? ''}`}
          className='min-h-11 w-full justify-between gap-2 px-3 text-left text-sm whitespace-normal'
        >
          <span className='text-muted-foreground'>{label}</span>
          <span className='ml-auto'>
            {options.find((option) => option.value === selected)?.label}
          </span>
          <ChevronDownIcon className='size-4 shrink-0' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start'>
        <DropdownMenuRadioGroup
          value={selected}
          onValueChange={(next) =>
            startTransition(() => {
              setValue(next);
            })
          }
        >
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
