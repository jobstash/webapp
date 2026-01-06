'use client';

import { useQueryState } from 'nuqs';

import { type Option } from '@/lib/types';
import { VirtualizedCommand } from '@/components/virtualized-command';

import { SuggestedFilterDropdown } from './suggested-filter-dropdown';

interface Props {
  label: string;
  paramKey: string;
  options: Option[];
}

export const SuggestedSearchFilter = ({ label, paramKey, options }: Props) => {
  const [, setFilterParam] = useQueryState(paramKey);

  return (
    <SuggestedFilterDropdown label={label} paramKey={paramKey}>
      <VirtualizedCommand
        options={options}
        placeholder={`Search ${label.toLowerCase()}...`}
        onSelect={setFilterParam}
      />
    </SuggestedFilterDropdown>
  );
};
