import { useState } from 'react';
import { ListFilterPlusIcon } from 'lucide-react';

import { FilterDropdown } from '@/features/filters/components/filter-dropdown';
import { FilterConfigSchema } from '@/features/filters/schemas';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from '@/components/ui/command';
import { FILTER_KIND } from '@/features/filters/constants';

import { useMoreFiltersOptions } from './use-more-filters-options';
import { MoreFiltersItem } from './more-filters-item';

interface Props {
  configs: FilterConfigSchema[];
}

export const MoreFilters = ({ configs }: Props) => {
  const options = useMoreFiltersOptions(configs);
  const [open, setOpen] = useState(false);
  const closeDropdown = () => setOpen(false);

  const onOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <FilterDropdown
      open={open}
      onOpenChange={onOpenChange}
      label='More Filters'
      icon={<ListFilterPlusIcon className='size-4' />}
      withDropdownIcon={false}
      classNames={{
        content: 'border-neutral-800 p-0',
        trigger:
          'h-7 items-center gap-1.5 border border-none bg-sidebar text-muted-foreground/80 hover:bg-muted data-[state=open]:bg-muted data-[state=open]:text-foreground',
      }}
    >
      <Command>
        <CommandInput placeholder='Search filters...' />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {options.map((config) => {
              return (
                <MoreFiltersItem
                  key={config.label}
                  paramKey={config.paramKey}
                  label={config.label}
                  defaultValue={getDefaultValue(config)}
                  closeDropdown={closeDropdown}
                />
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </FilterDropdown>
  );
};

const getDefaultValue = (config: FilterConfigSchema) => {
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
};
