import { RadioFilterConfigSchema } from '@/lib/filters/core/schemas';

import { Label } from '@/lib/shared/ui/base/label';
import { RadioGroup, RadioGroupItem } from '@/lib/shared/ui/base/radio-group';

import { FilterAccordionItem } from './filter-accordion-item';

interface Props {
  config: RadioFilterConfigSchema;
}

export const RadioFilter = ({ config }: Props) => {
  const { options } = config;
  return (
    <FilterAccordionItem label={config.label}>
      <RadioGroup className='flex flex-col gap-2'>
        {options.map(({ value, label }) => (
          <div key={value} className='flex items-center space-x-2'>
            <RadioGroupItem id={value} value={value} />
            <Label htmlFor={value} className='text-muted-foreground'>
              {label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </FilterAccordionItem>
  );
};
