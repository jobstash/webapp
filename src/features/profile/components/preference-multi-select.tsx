'use client';

import { useId, useMemo, useState } from 'react';
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import type { PreferenceOption } from '../job-preference-options';

interface PreferenceMultiSelectProps {
  label: string;
  value: string[];
  options: PreferenceOption[];
  onChange: (value: string[]) => void;
  placeholder: string;
  searchPlaceholder?: string;
  allowCustom?: boolean;
  customLabel?: string;
  validateCustom?: (value: string) => boolean;
  normalizeCustom?: (value: string) => string;
  id?: string;
  className?: string;
}

export const PreferenceMultiSelect = ({
  label,
  value,
  options,
  onChange,
  placeholder,
  searchPlaceholder = 'Search choices…',
  allowCustom = false,
  customLabel = 'Add',
  validateCustom,
  normalizeCustom = (item) => item.trim(),
  id,
  className,
}: PreferenceMultiSelectProps) => {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const allOptions = useMemo(() => {
    const knownValues = new Set(options.map((option) => option.value));
    return [
      ...options,
      ...value
        .filter((selected) => !knownValues.has(selected))
        .map((selected) => ({ label: selected, value: selected })),
    ];
  }, [options, value]);

  const labels = value.map(
    (selected) =>
      allOptions.find((option) => option.value === selected)?.label ?? selected,
  );
  const normalizedSearch = normalizeCustom(search);
  const hasExactChoice = allOptions.some(
    (option) =>
      option.value.toLocaleLowerCase() ===
        normalizedSearch.toLocaleLowerCase() ||
      option.label.toLocaleLowerCase() === normalizedSearch.toLocaleLowerCase(),
  );
  const canAdd =
    allowCustom &&
    normalizedSearch.length > 0 &&
    !hasExactChoice &&
    (validateCustom?.(normalizedSearch) ?? true);

  const toggle = (selected: string) => {
    onChange(
      value.includes(selected)
        ? value.filter((item) => item !== selected)
        : [...value, selected],
    );
  };

  const addCustom = () => {
    if (!canAdd) return;
    onChange([...value, normalizedSearch]);
    setSearch('');
  };

  return (
    <div className={cn('text-sm', className)}>
      <span className='mb-1 block'>{label}</span>
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) setSearch('');
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id={id}
            type='button'
            variant='outline'
            role='combobox'
            aria-label={label}
            aria-expanded={open}
            aria-controls={listId}
            className='h-auto min-h-10 w-full justify-between bg-background px-3 py-2 text-left font-normal hover:bg-background'
          >
            <span
              className={cn(
                'min-w-0 truncate',
                labels.length === 0 && 'text-muted-foreground',
              )}
            >
              {labels.length === 0
                ? placeholder
                : labels.length <= 2
                  ? labels.join(', ')
                  : `${labels.slice(0, 2).join(', ')} +${labels.length - 2}`}
            </span>
            <ChevronsUpDownIcon className='ml-2 size-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align='start'
          className='w-(--radix-popover-trigger-width) p-0'
        >
          <Command>
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder={searchPlaceholder}
            />
            <CommandList id={listId} className='max-h-64 overscroll-contain'>
              <CommandEmpty>
                {allowCustom
                  ? 'Type a value and choose Add.'
                  : 'No matching choice.'}
              </CommandEmpty>
              <CommandGroup>
                {allOptions.map((option) => {
                  const selected = value.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={`${option.label} ${option.value}`}
                      onSelect={() => toggle(option.value)}
                    >
                      <CheckIcon
                        className={cn(
                          'size-4',
                          selected ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  );
                })}
                {canAdd && (
                  <CommandItem value={normalizedSearch} onSelect={addCustom}>
                    <PlusIcon className='size-4' />
                    {customLabel} “{normalizedSearch}”
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
