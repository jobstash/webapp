'use client';

import { ClassValue } from 'clsx';

import { cn } from '@/lib/shared/utils';

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/lib/shared/ui/base/command';

interface Props {
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  classNames?: {
    base?: ClassValue;
    item?: ClassValue;
  };
}

export const SimpleCommand = ({ options, onSelect, classNames }: Props) => {
  return (
    <Command className={cn(classNames?.base)}>
      <CommandList>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.label}
              value={option.value}
              onSelect={onSelect}
              className={cn(classNames?.item)}
            >
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
