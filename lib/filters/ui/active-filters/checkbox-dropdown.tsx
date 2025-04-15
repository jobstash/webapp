'use client';

import { CheckboxFilterConfigSchema } from '@/lib/filters/core/schemas';

import { Checkbox } from '@/lib/shared/ui/base/checkbox';
import { Label } from '@/lib/shared/ui/base/label';
import { FilterDropdown } from '@/lib/filters/ui/filter-dropdown';

import { useCsvParam } from './use-csv-param';
import { useDropdownLabel } from './use-dropdown-label';

interface Props {
  config: CheckboxFilterConfigSchema;
}

export const CheckboxDropdown = ({ config }: Props) => {
  const label = useDropdownLabel(config);
  const { checkIsActive, toggleItem } = useCsvParam(config.paramKey);
  return (
    <FilterDropdown label={label} classNames={{ trigger: 'rounded-l-none border-l-0' }}>
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
