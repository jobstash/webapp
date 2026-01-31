'use client';

import { useState, useTransition } from 'react';

import { type Option } from '@/lib/types';
import { GA_EVENT, trackEvent } from '@/lib/analytics';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { VirtualizedCommand } from '@/components/virtualized-command';
import { FILTER_POPOVER_CONTENT_CLASS } from '@/features/filters/constants';
import { useFilterQueryState } from '@/features/filters/hooks';
import { MappedFilterIcon } from '@/features/filters/components/mapped-filter-icon';

import { SuggestedFilterTrigger } from './suggested-filter-trigger';

interface Props {
  label: string;
  paramKey: string;
  options: Option[];
}

export const SuggestedFilterSearch = ({ label, paramKey, options }: Props) => {
  const [, setFilterParam] = useFilterQueryState(paramKey);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const handleSelect = (value: string) => {
    trackEvent(GA_EVENT.SUGGESTED_FILTER_APPLIED, { filter_name: paramKey });
    setOpen(false);
    startTransition(() => {
      setFilterParam(value);
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={isPending} asChild>
        <SuggestedFilterTrigger
          isPending={isPending}
          label={label}
          icon={<MappedFilterIcon paramKey={paramKey} />}
        />
      </PopoverTrigger>
      <PopoverContent
        side='bottom'
        align='start'
        className={FILTER_POPOVER_CONTENT_CLASS}
      >
        <VirtualizedCommand
          options={options}
          placeholder={`Search ${label.toLowerCase()}...`}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
};
