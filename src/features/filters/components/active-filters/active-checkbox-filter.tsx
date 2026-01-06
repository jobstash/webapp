'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { type CheckboxFilterConfigSchema } from '@/features/filters/schemas';
import { useDropdownLabel } from '@/features/filters/hooks';
import { FilterDropdown } from '@/features/filters/components/filter-dropdown';

import { useCsvParam } from './use-csv-param';

interface Props {
  config: CheckboxFilterConfigSchema;
}

export const ActiveCheckboxFilter = ({ config }: Props) => {
  const label = useDropdownLabel(config);
  const { checkIsActive, toggleItem } = useCsvParam(config.paramKey);
  return (
    <FilterDropdown
      label={label}
      classNames={{ trigger: 'rounded-l-none border-l-0' }}
    >
      {config.options.map(({ value, label }) => (
        <div key={label} className='flex items-center space-x-2'>
          <Checkbox
            value={value}
            checked={checkIsActive(value)}
            onCheckedChange={(checked) => toggleItem(value, !!checked)}
          />
          <Label htmlFor={value} className='text-muted-foreground'>
            {label}
          </Label>
        </div>
      ))}
    </FilterDropdown>
  );
};
