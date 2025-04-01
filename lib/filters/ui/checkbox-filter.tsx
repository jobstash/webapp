import { CheckboxFilterConfigSchema } from '@/lib/filters/core/schemas';

import { Checkbox } from '@/lib/shared/ui/base/checkbox';
import { Label } from '@/lib/shared/ui/base/label';

import { FilterAccordionItem } from './filter-accordion-item';

interface Props {
  config: CheckboxFilterConfigSchema;
}

export const CheckboxFilter = ({ config }: Props) => {
  const { options } = config;
  return (
    <FilterAccordionItem label={config.label}>
      <div className='flex flex-col gap-2'>
        {options.map(({ value, label }) => (
          <div key={value} className='flex items-center space-x-2'>
            <Checkbox id={value} value={value} />
            <Label htmlFor={value} className='text-muted-foreground'>
              {label}
            </Label>
          </div>
        ))}
      </div>
    </FilterAccordionItem>
  );
};
