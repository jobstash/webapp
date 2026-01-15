'use client';

import { useTransition } from 'react';

import { type Option } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MappedFilterIcon } from '@/features/filters/components/mapped-filter-icon';
import { FILTER_DROPDOWN_CONTENT_CLASS } from '@/features/filters/constants';

import { ActiveFilterTrigger } from './active-filter-trigger';
import { useCsvParam } from './use-csv-param';

interface Props {
  label: string;
  paramKey: string;
  options: Option[];
}

export const ActiveFilterCheckbox = ({ label, paramKey, options }: Props) => {
  const [isPending, startTransition] = useTransition();

  const { values, checkIsActive, toggleItem, setFilterParam } =
    useCsvParam(paramKey);

  const handleSelect = (value: string, checked: boolean) => {
    startTransition(() => {
      toggleItem(value, checked);
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
          label={`${label} (${values.length})`}
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
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={checkIsActive(option.value)}
            onCheckedChange={(checked) => handleSelect(option.value, checked)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
