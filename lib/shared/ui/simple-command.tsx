'use client';

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/lib/shared/ui/base/command';

interface Props {
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
}

export const SimpleCommand = ({ options, onSelect }: Props) => {
  return (
    <Command>
      <CommandList>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem key={option.label} value={option.value} onSelect={onSelect}>
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
