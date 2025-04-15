'use client';

import { useQueryState } from 'nuqs';

import {
  CheckboxFilterConfigSchema,
  RadioFilterConfigSchema,
  SingleSelectFilterConfigSchema,
} from '@/lib/filters/core/schemas';

import { SimpleCommand } from '@/lib/shared/ui/simple-command';

import { Dropdown } from './dropdown';

interface Props {
  config:
    | CheckboxFilterConfigSchema
    | RadioFilterConfigSchema
    | SingleSelectFilterConfigSchema;
}

export const SingleselectDropdown = ({ config }: Props) => {
  const [, setFilterParam] = useQueryState(config.paramKey);

  return (
    <Dropdown config={config}>
      <SimpleCommand onSelect={setFilterParam} options={config.options} />
    </Dropdown>
  );
};
