'use client';

import { useState, useTransition } from 'react';

import { type Option } from '@/lib/types';
import { capitalizeSlug } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { REMOTE_FILTERS } from '@/features/filters/constants';
import { RemoteVirtualizedCommand } from '@/components/remote-virtualized-command';
import { useFilterQueryState } from '@/features/filters/hooks';
import { MappedFilterIcon } from '@/features/filters/components/mapped-filter-icon';

import { SuggestedFilterTrigger } from './suggested-filter-trigger';

interface Props {
  label: string;
  paramKey: string;
  options: Option[];
}

export const SuggestedFilterRemoteSearch = ({
  label,
  paramKey,
  options,
}: Props) => {
  const [, setFilterParam] = useFilterQueryState(paramKey);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const handleSelect = (value: string) => {
    setOpen(false);
    startTransition(() => {
      setFilterParam(value);
    });
  };

  const endpointUrl = REMOTE_FILTERS[paramKey as keyof typeof REMOTE_FILTERS];
  const endpoint = (query: string) => `${endpointUrl}?query=${query}`;

  const initialValues = options.map((option) => option.value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={isPending} asChild>
        <SuggestedFilterTrigger
          isPending={isPending}
          label={label}
          icon={<MappedFilterIcon paramKey={paramKey} />}
          disabled={isPending}
        />
      </PopoverTrigger>
      <PopoverContent
        side='bottom'
        align='start'
        className='relative flex w-fit max-w-60 min-w-32 flex-col gap-2 border-neutral-800 p-0'
      >
        <RemoteVirtualizedCommand<{ name: string; normalizedName: string }[]>
          queryKeyPrefix={paramKey}
          endpoint={endpoint}
          initialValues={initialValues}
          selectedValues={[]}
          responseToValues={(data) => data.map((d) => d.normalizedName)}
          formatLabel={capitalizeSlug}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
};
