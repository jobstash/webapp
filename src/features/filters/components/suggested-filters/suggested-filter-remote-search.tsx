'use client';

import { useState, useTransition } from 'react';

import { type Option } from '@/lib/types';
import { capitalizeSlug } from '@/lib/utils';
import { GA_EVENT, trackEvent } from '@/lib/analytics';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RemoteVirtualizedCommand } from '@/components/remote-virtualized-command';
import { FILTER_POPOVER_CONTENT_CLASS } from '@/features/filters/constants';
import { getRemoteFilterEndpoint } from '@/features/filters/utils';
import { useFilterQueryState } from '@/features/filters/hooks';
import { MappedFilterIcon } from '@/features/filters/components/mapped-filter-icon';

import { SuggestedFilterTrigger } from './suggested-filter-trigger';

interface Props {
  label: string;
  paramKey: string;
  options: Option[];
  excludeValues?: string[];
}

export const SuggestedFilterRemoteSearch = ({
  label,
  paramKey,
  options,
  excludeValues,
}: Props) => {
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

  const endpoint = getRemoteFilterEndpoint(paramKey);

  const initialValues = options.map((option) => option.value);

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
        <RemoteVirtualizedCommand<{ name: string; normalizedName: string }[]>
          queryKeyPrefix={paramKey}
          endpoint={endpoint}
          initialValues={initialValues}
          selectedValues={[]}
          excludeValues={excludeValues}
          responseToValues={(data) => data.map((d) => d.normalizedName)}
          formatLabel={capitalizeSlug}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
};
