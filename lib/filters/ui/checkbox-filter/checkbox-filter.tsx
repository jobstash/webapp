'use client';

import { CheckboxFilterConfigSchema } from '@/lib/filters/core/schemas';

import { Checkbox } from '@/lib/shared/ui/base/checkbox';
import { Label } from '@/lib/shared/ui/base/label';

import { FilterAccordionItem } from '../filter-accordion-item';

import { useCheckboxFilter } from './use-checkbox-filter';

interface Props {
  config: CheckboxFilterConfigSchema;
}

export const CheckboxFilter = ({ config }: Props) => {
  const { options, paramKey, label } = config;
  const { isItemChecked, toggleItem } = useCheckboxFilter(paramKey);

  return (
    <FilterAccordionItem label={label}>
      <div className='flex flex-col gap-2'>
        {options.map(({ value, label }) => (
          <div key={label} className='flex items-center space-x-2'>
            <Checkbox
              value={value}
              checked={isItemChecked(value)}
              onCheckedChange={(checked) => toggleItem(value, checked)}
            />
            <Label htmlFor={value} className='text-muted-foreground'>
              {label}
            </Label>
          </div>
        ))}
      </div>
    </FilterAccordionItem>
  );
};
