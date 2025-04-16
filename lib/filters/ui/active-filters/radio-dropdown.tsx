'use client';

import { useQueryState } from 'nuqs';

import {
  RadioFilterConfigSchema,
  SingleSelectFilterConfigSchema,
} from '@/lib/filters/core/schemas';

import { useDropdownLabel } from '@/lib/filters/hooks/use-dropdown-label';

import { Label } from '@/lib/shared/ui/base/label';
import { RadioGroup, RadioGroupItem } from '@/lib/shared/ui/base/radio-group';
import { FilterDropdown } from '@/lib/filters/ui/filter-dropdown';

interface Props {
  config: RadioFilterConfigSchema | SingleSelectFilterConfigSchema;
}

export const RadioDropdown = ({ config }: Props) => {
  const label = useDropdownLabel(config);
  const [filterParam, setFilterParam] = useQueryState(config.paramKey);
  return (
    <FilterDropdown label={label} classNames={{ trigger: 'rounded-l-none border-l-0' }}>
      <RadioGroup
        className='flex flex-col gap-2'
        value={filterParam ?? undefined}
        onValueChange={setFilterParam}
      >
        {config.options.map(({ value, label }) => (
          <div key={value} className='flex items-center space-x-2'>
            <RadioGroupItem id={value} value={value} />
            <Label htmlFor={value} className='text-muted-foreground'>
              {label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </FilterDropdown>
  );
};
