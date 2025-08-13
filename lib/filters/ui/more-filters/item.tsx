'use client';

import { useMemo } from 'react';

import { useQueryState } from 'nuqs';

import { FILTER_KIND } from '@/lib/filters/core/constants';
import { FilterConfigSchema } from '@/lib/filters/core/schemas';

import { useFilterIcon } from '@/lib/filters/hooks/use-filter-icon';

import { CommandItem } from '@/lib/shared/ui/base/command';

interface Props {
  config: FilterConfigSchema;
  closeDropdown: () => void;
}

export const Item = ({ config, closeDropdown }: Props) => {
  const [, setFilterParam] = useQueryState(config.paramKey);
  const { icon } = useFilterIcon(config);

  const defaultValue = useMemo(() => {
    switch (config.kind) {
      case FILTER_KIND.SWITCH:
        return 'true';
      case FILTER_KIND.RADIO:
      case FILTER_KIND.CHECKBOX:
      case FILTER_KIND.SINGLE_SELECT:
      case FILTER_KIND.MULTI_SELECT:
        return config.options[0].value;
      default:
        return null;
    }
  }, [config]);

  const onSelect = () => {
    setFilterParam(defaultValue);
    closeDropdown();
  };

  return (
    <CommandItem key={config.label} className='hover:cursor-pointer' onSelect={onSelect}>
      <div className='flex items-center gap-2'>
        <div className='grid size-4 place-items-center'>{icon}</div>
        {config.label}
      </div>
    </CommandItem>
  );
};
