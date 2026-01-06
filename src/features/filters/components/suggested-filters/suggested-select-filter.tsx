'use client';

import { useQueryState } from 'nuqs';

import { SimpleCommand } from '@/components/simple-command';

import { SuggestedFilterDropdown } from './suggested-filter-dropdown';
import {
  CheckboxFilterConfigSchema,
  RadioFilterConfigSchema,
  SingleSelectFilterConfigSchema,
} from '@/features/filters/schemas';

interface Props {
  config:
    | CheckboxFilterConfigSchema
    | RadioFilterConfigSchema
    | SingleSelectFilterConfigSchema;
}

export const SuggestedSelectFilter = ({ config }: Props) => {
  const [, setFilterParam] = useQueryState(config.paramKey);

  return (
    <SuggestedFilterDropdown label={config.label} paramKey={config.paramKey}>
      <SimpleCommand onSelect={setFilterParam} options={config.options} />
    </SuggestedFilterDropdown>
  );
};
