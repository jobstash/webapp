'use client';

import { useQueryState } from 'nuqs';

import { SwitchFilterConfigSchema } from '@/lib/filters/core/schemas';

import { ItemButton } from './item-button';

interface Props {
  config: SwitchFilterConfigSchema;
}

export const SwitchItem = ({ config }: Props) => {
  const [, setFilterParam] = useQueryState(config.paramKey);
  const onClick = () => setFilterParam('true');
  return <ItemButton config={config} onClick={onClick} />;
};
