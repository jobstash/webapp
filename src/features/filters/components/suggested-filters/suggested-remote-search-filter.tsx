'use client';

import { useQueryState } from 'nuqs';

import { type Option } from '@/lib/types';
import { capitalizeSlug } from '@/lib/utils';
import { REMOTE_FILTERS } from '@/features/filters/constants';
import { RemoteVirtualizedCommand } from '@/components/remote-virtualized-command';

import { SuggestedFilterDropdown } from './suggested-filter-dropdown';

interface Props {
  label: string;
  paramKey: string;
  options: Option[];
}

export const SuggestedRemoteSearchFilter = ({
  label,
  paramKey,
  options,
}: Props) => {
  const [, setFilterParam] = useQueryState(paramKey);

  const endpointUrl = REMOTE_FILTERS[paramKey as keyof typeof REMOTE_FILTERS];
  const endpoint = (query: string) => `${endpointUrl}?query=${query}`;

  const initialValues = options.map((option) => option.value);

  return (
    <SuggestedFilterDropdown label={label} paramKey={paramKey}>
      <RemoteVirtualizedCommand<{ name: string; normalizedName: string }[]>
        endpoint={endpoint}
        initialValues={initialValues}
        selectedValues={[]}
        responseToValues={(data) => data.map((d) => d.normalizedName)}
        formatLabel={capitalizeSlug}
        onSelect={setFilterParam}
      />
    </SuggestedFilterDropdown>
  );
};
