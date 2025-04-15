'use client';

import { ClassValue } from 'clsx';
import { ChevronDownIcon } from 'lucide-react';

import { cn } from '@/lib/shared/utils';

import { Button } from '@/lib/shared/ui/base/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/lib/shared/ui/base/popover';

export interface FilterDropdownProps extends React.PropsWithChildren {
  label: string;
  classNames?: {
    trigger?: ClassValue;
    triggerIcon?: ClassValue;
    content?: ClassValue;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  icon?: React.ReactNode;
  withDropdownIcon?: boolean;
}

export const FilterDropdown = (props: FilterDropdownProps) => {
  const {
    label,
    children,
    classNames,
    open,
    onOpenChange,
    icon = null,
    withDropdownIcon = true,
  } = props;

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          size='xs'
          variant='secondary'
          className={cn(
            'flex h-7 items-center gap-1.5 px-2',
            'text-sm',
            classNames?.trigger,
          )}
        >
          {icon}
          {label}
          {withDropdownIcon && (
            <ChevronDownIcon
              className={cn('size-3.5 text-neutral-400', classNames?.triggerIcon)}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side='bottom'
        align='start'
        className={cn(
          'relative flex flex-col gap-2',
          'w-fit max-w-60 min-w-32',
          classNames?.content,
        )}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
};
