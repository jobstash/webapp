import { SearchCheckIcon } from 'lucide-react';

import { CommandGroup, CommandItem } from '@/components/ui/command';

interface Props {
  values: string[];
  formatLabel: (value: string) => string;
  onDeselect?: (value: string) => void;
}

export const SelectedItems = ({ values, formatLabel, onDeselect }: Props) => {
  if (values.length === 0) return null;

  return (
    <CommandGroup heading='Selected'>
      {values.map((value) => (
        <CommandItem
          key={value}
          onSelect={() => onDeselect?.(value)}
          className='data-[selected=true]:bg-white/5'
        >
          <SearchCheckIcon className='size-3.5 text-primary' />
          {formatLabel(value)}
        </CommandItem>
      ))}
    </CommandGroup>
  );
};
