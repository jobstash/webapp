'use client';

import { useTransition } from 'react';

import { type Option } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFilterQueryState } from '@/features/filters/hooks';
import { MappedFilterIcon } from '@/features/filters/components/mapped-filter-icon';
import { FILTER_DROPDOWN_CONTENT_CLASS } from '@/features/filters/constants';

import { ActiveFilterTrigger } from './active-filter-trigger';

interface Props {
  label: string;
  paramKey: string;
  options: Option[];
}

export const ActiveFilterRadio = ({ label, paramKey, options }: Props) => {
  const [filterParam, setFilterParam] = useFilterQueryState(paramKey);

  const [isPending, startTransition] = useTransition();

  const findActiveLabel = (value: string | null) => {
    return options.find((option) => option.value === value)?.label;
  };

  const handleSelect = (value: string) => {
    startTransition(() => {
      setFilterParam(value);
    });
  };

  const handleClose = () => {
    startTransition(() => {
      setFilterParam(null);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isPending} asChild>
        <ActiveFilterTrigger
          isPending={isPending}
          label={findActiveLabel(filterParam) ?? ''}
          tooltipLabel={label}
          icon={<MappedFilterIcon paramKey={paramKey} />}
          onClose={handleClose}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side='bottom'
        align='start'
        className={FILTER_DROPDOWN_CONTENT_CLASS}
      >
        <DropdownMenuRadioGroup
          value={filterParam ?? undefined}
          onValueChange={handleSelect}
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
};
