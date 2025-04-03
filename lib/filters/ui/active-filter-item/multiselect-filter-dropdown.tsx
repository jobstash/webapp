import { useMemo, useState } from 'react';

import { ChevronDownIcon, SearchCheckIcon } from 'lucide-react';

import { MultiSelectFilterConfigSchema } from '@/lib/filters/core/schemas';

import { Button } from '@/lib/shared/ui/base/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/lib/shared/ui/base/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/lib/shared/ui/base/popover';
import { useCsvFilterParams } from '@/lib/filters/ui/active-filter-item/use-csv-filter-params';

import { getActiveFilterValueLabel } from './get-active-filter-value-label';
interface Props {
  config: MultiSelectFilterConfigSchema;
  filterParamValue: string;
}

export const MultiselectFilterDropdown = ({ config, filterParamValue }: Props) => {
  const label = getActiveFilterValueLabel(config, filterParamValue);
  const { isActiveParam, toggleItem } = useCsvFilterParams(config.paramKey, config.label);

  const options = useMemo(() => {
    return config.options.filter((option) => {
      return !isActiveParam(option.value);
    });
  }, [config.options, isActiveParam]);

  const selectedOptions = useMemo(() => {
    return config.options.filter((option) => isActiveParam(option.value));
  }, [config.options, isActiveParam]);

  const [searchInput, setSearchInput] = useState('');
  const onToggleItem = (value: string, nextState: boolean) => {
    toggleItem(value, nextState);
    setSearchInput('');
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size='xs'
          variant='secondary'
          className='flex h-7 items-center gap-1.5 rounded-l-none border-l-0 px-2 text-sm hover:bg-neutral-700/50'
        >
          {label}
          <ChevronDownIcon className='size-3.5 text-neutral-400' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side='bottom'
        align='start'
        className='relative flex w-52 flex-col gap-2 bg-muted p-0'
      >
        <Command className='bg-muted'>
          <CommandInput
            placeholder={`Search ${config.label.toLowerCase()} ...`}
            value={searchInput}
            onValueChange={setSearchInput}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading='Selected'>
              {selectedOptions.map(({ label, value }) => (
                <CommandItem key={label} onSelect={() => onToggleItem(value, false)}>
                  <SearchCheckIcon className='size-3.5 text-primary' />
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading='Options'>
              {options.map(({ label, value }) => (
                <CommandItem key={label} onSelect={() => onToggleItem(value, true)}>
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
