'use client';

import { useTransition } from 'react';

import { type Option } from '@/lib/types';
import { GA_EVENT, trackEvent } from '@/lib/analytics';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FILTER_DROPDOWN_CONTENT_CLASS } from '@/features/filters/constants';
import { useFilterQueryState } from '@/features/filters/hooks';
import { MappedFilterIcon } from '@/features/filters/components/mapped-filter-icon';

import { SuggestedFilterTrigger } from './suggested-filter-trigger';

interface Props {
  label: string;
  paramKey: string;
  options: Option[];
}

export const SuggestedFilterSelect = ({ label, paramKey, options }: Props) => {
  const [, setFilterParam] = useFilterQueryState(paramKey);

  const [isPending, startTransition] = useTransition();

  const handleSelect = (value: string) => {
    trackEvent(GA_EVENT.SUGGESTED_FILTER_APPLIED, { filter_name: paramKey });
    startTransition(() => {
      setFilterParam(value);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isPending} asChild>
        <SuggestedFilterTrigger
          isPending={isPending}
          label={label}
          icon={<MappedFilterIcon paramKey={paramKey} />}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side='bottom'
        align='start'
        className={FILTER_DROPDOWN_CONTENT_CLASS}
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => handleSelect(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
