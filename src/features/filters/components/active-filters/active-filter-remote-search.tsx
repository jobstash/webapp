'use client';

import { useState, useTransition } from 'react';
import { useQueryState } from 'nuqs';

import { type Option } from '@/lib/types';
import { capitalizeSlug } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RemoteVirtualizedCommand } from '@/components/remote-virtualized-command';
import { MappedFilterIcon } from '@/features/filters/components/mapped-filter-icon';
import { REMOTE_FILTERS } from '@/features/filters/constants';

import { ActiveFilterTrigger } from './active-filter-trigger';
import { useCsvParam } from './use-csv-param';

interface Props {
  label: string;
  paramKey: string;
  options: Option[];
}

export const ActiveFilterRemoteSearch = ({
  label,
  paramKey,
  options,
}: Props) => {
  const [filterParam, setFilterParam] = useQueryState(paramKey);
  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);

  const { values, toggleItem } = useCsvParam(paramKey);

  const handleSelect = (value: string, checked: boolean) => {
    setOpen(false);
    startTransition(() => {
      setFilterParam(value);
      toggleItem(value, checked);
    });
  };

  const handleClose = () => {
    startTransition(() => {
      setFilterParam(null);
    });
  };

  const endpointUrl = REMOTE_FILTERS[paramKey as keyof typeof REMOTE_FILTERS];
  const endpoint = (query: string) => `${endpointUrl}?query=${query}`;

  const initialValues = options.map((option) => option.value);
  const selectedValues = filterParam?.split(',') || [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={isPending} asChild>
        <ActiveFilterTrigger
          isPending={isPending}
          label={`${label} (${values.length})`}
          tooltipLabel={label}
          icon={<MappedFilterIcon paramKey={paramKey} />}
          onClose={handleClose}
        />
      </PopoverTrigger>
      <PopoverContent
        side='bottom'
        align='start'
        className='relative flex w-fit max-w-60 min-w-32 flex-col gap-2 border-neutral-800 p-0'
      >
        <RemoteVirtualizedCommand<{ name: string; normalizedName: string }[]>
          endpoint={endpoint}
          initialValues={initialValues}
          selectedValues={selectedValues}
          responseToValues={(data) => data.map((d) => d.normalizedName)}
          formatLabel={capitalizeSlug}
          onSelect={(value) => handleSelect(value, true)}
          onDeselect={(value) => handleSelect(value, false)}
          classNames={{
            command: 'bg-secondary',
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
