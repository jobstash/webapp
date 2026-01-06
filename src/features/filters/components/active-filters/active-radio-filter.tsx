'use client';

import { useQueryState } from 'nuqs';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FilterDropdown } from '@/features/filters/components/filter-dropdown';
import { useDropdownLabel } from '@/features/filters/hooks';
import type {
  RadioFilterConfigSchema,
  SingleSelectFilterConfigSchema,
} from '@/features/filters/schemas';

interface Props {
  config: RadioFilterConfigSchema | SingleSelectFilterConfigSchema;
}

export const ActiveRadioFilter = ({ config }: Props) => {
  const label = useDropdownLabel(config);
  const [filterParam, setFilterParam] = useQueryState(config.paramKey);
  return (
    <FilterDropdown
      label={label}
      classNames={{ trigger: 'rounded-l-none border-l-0' }}
    >
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
